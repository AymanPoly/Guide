'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, VolumeX, Search, X } from 'lucide-react'

interface VoiceSearchProps {
  onSearch: (query: string) => void
  onTranscript: (transcript: string) => void
  className?: string
}

export default function VoiceSearch({ onSearch, onTranscript, className = '' }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      setIsSupported(true)
      recognitionRef.current = new SpeechRecognition()
      
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)
        onTranscript(currentTranscript)

        if (finalTranscript) {
          setIsProcessing(true)
          setTimeout(() => {
            onSearch(finalTranscript)
            setIsProcessing(false)
            setIsListening(false)
          }, 1000)
        }
      }

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setError(`Error: ${event.error}`)
        setIsListening(false)
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [onSearch, onTranscript])

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('')
      setError(null)
      recognitionRef.current.start()
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
  }

  const speak = (text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      
      synthesisRef.current = new SpeechSynthesisUtterance(text)
      synthesisRef.current.rate = 0.9
      synthesisRef.current.pitch = 1
      synthesisRef.current.volume = 0.8
      
      synthesisRef.current.onstart = () => {
        console.log('Speech started')
      }
      
      synthesisRef.current.onend = () => {
        console.log('Speech ended')
      }
      
      window.speechSynthesis.speak(synthesisRef.current)
    }
  }

  const clearTranscript = () => {
    setTranscript('')
    setError(null)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
    }
  }

  if (!isSupported) {
    return (
      <div className={`text-center py-4 ${className}`}>
        <div className="text-gray-500 text-sm">
          Voice search is not supported in this browser
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Search Interface */}
      <div className="flex items-center space-x-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={isProcessing}
          className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
              : 'bg-primary-600 hover:bg-primary-700 text-white'
            }
            ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </button>

        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder={isListening ? "Listening..." : "Search by voice or type..."}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && transcript.trim()) {
                  onSearch(transcript.trim())
                }
              }}
            />
            {transcript && (
              <button
                onClick={clearTranscript}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <button
          onClick={toggleMute}
          className={`p-2 rounded-lg transition-colors duration-200 ${
            isMuted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title={isMuted ? 'Unmute voice feedback' : 'Mute voice feedback'}
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Status Indicators */}
      {isListening && (
        <div className="flex items-center space-x-2 text-sm text-primary-600">
          <div className="w-2 h-2 bg-primary-600 rounded-full animate-pulse" />
          <span>Listening... Speak now</span>
        </div>
      )}

      {isProcessing && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin" />
          <span>Processing your request...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 text-sm text-red-600">
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          <span>{error}</span>
        </div>
      )}

      {/* Voice Commands Help */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">Voice Commands</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600">
          <div>• "Find experiences in Marrakech"</div>
          <div>• "Show me food tours"</div>
          <div>• "Under $100 experiences"</div>
          <div>• "Cultural activities"</div>
          <div>• "Morning experiences"</div>
          <div>• "Highly rated tours"</div>
        </div>
      </div>
    </div>
  )
}

// Voice feedback component
interface VoiceFeedbackProps {
  message: string
  autoSpeak?: boolean
  onComplete?: () => void
}

export function VoiceFeedback({ message, autoSpeak = true, onComplete }: VoiceFeedbackProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    if (autoSpeak && message) {
      speakMessage(message)
    }
  }, [message, autoSpeak])

  const speakMessage = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => {
        setIsSpeaking(false)
        onComplete?.()
      }
      
      window.speechSynthesis.speak(utterance)
    }
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  return (
    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
      <div className="flex-shrink-0">
        {isSpeaking ? (
          <button
            onClick={stopSpeaking}
            className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
          >
            <VolumeX className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => speakMessage(message)}
            className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors duration-200"
          >
            <Volume2 className="h-4 w-4" />
          </button>
        )}
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-gray-700">{message}</p>
        {isSpeaking && (
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" />
            <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-1 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
    </div>
  )
}

// Voice tutorial component
export function VoiceTutorial() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const steps = [
    {
      title: "Welcome to Voice Search",
      description: "Use your voice to search for experiences quickly and easily",
      demo: "Hello! I'm your voice assistant. Try saying 'Find experiences in Marrakech'"
    },
    {
      title: "Voice Commands",
      description: "You can search by location, type, price, or time",
      demo: "You can say things like 'Show me food tours under $50' or 'Cultural activities in the morning'"
    },
    {
      title: "Natural Language",
      description: "Speak naturally - I understand context and intent",
      demo: "Try saying 'I want something fun to do this weekend' or 'What's popular right now?'"
    }
  ]

  const currentStepData = steps[currentStep]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">{currentStepData.title}</h3>
          <p className="text-sm text-gray-600 mt-2">{currentStepData.description}</p>
        </div>

        {isDemoMode && (
          <VoiceFeedback 
            message={currentStepData.demo}
            autoSpeak={true}
            onComplete={() => setIsDemoMode(false)}
          />
        )}

        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setIsDemoMode(true)}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Demo
            </button>
            <button
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
