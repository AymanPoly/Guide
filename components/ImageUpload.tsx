'use client'

import { useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Upload, X, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ImageUploadProps {
  onImageUpload: (imageUrl: string, altText: string) => void
  onImageRemove: () => void
  currentImageUrl?: string
  currentAltText?: string
  experienceId?: string
  disabled?: boolean
}

export default function ImageUpload({
  onImageUpload,
  onImageRemove,
  currentImageUrl,
  currentAltText,
  experienceId,
  disabled = false
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [altText, setAltText] = useState(currentAltText || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB')
      return
    }

    setUploading(true)

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = experienceId 
        ? `${experienceId}/${Date.now()}.${fileExt}`
        : `temp/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('experience-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        toast.error('Failed to upload image')
        return
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('experience-images')
        .getPublicUrl(fileName)

      // Call the callback with the image URL and alt text
      onImageUpload(publicUrl, altText || file.name)

      toast.success('Image uploaded successfully!', {
        icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      })

    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleRemoveImage = async () => {
    if (!currentImageUrl) return

    try {
      // Extract filename from URL
      const urlParts = currentImageUrl.split('/')
      const fileName = urlParts[urlParts.length - 2] + '/' + urlParts[urlParts.length - 1]

      // Delete from storage
      const { error } = await supabase.storage
        .from('experience-images')
        .remove([fileName])

      if (error) {
        console.error('Delete error:', error)
        toast.error('Failed to delete image')
        return
      }

      // Call the callback to remove the image
      onImageRemove()

      toast.success('Image removed successfully!')

    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Failed to delete image')
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {/* Image Preview */}
      {currentImageUrl && (
        <div className="relative">
          <div className="relative group">
            <img
              src={currentImageUrl}
              alt={currentAltText || 'Experience image'}
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            {!disabled && (
              <button
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!currentImageUrl && (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={disabled ? undefined : openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-4">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
              ) : (
                <Upload className="h-6 w-6 text-gray-400" />
              )}
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {uploading ? 'Uploading...' : 'Upload Experience Image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop an image here, or click to select
              </p>
              <p className="text-xs text-gray-400 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Alt Text Input */}
      {currentImageUrl && (
        <div>
          <label htmlFor="alt-text" className="label">
            Image Description (for accessibility)
          </label>
          <input
            id="alt-text"
            type="text"
            value={altText}
            onChange={(e) => setAltText(e.target.value)}
            onBlur={() => onImageUpload(currentImageUrl, altText)}
            className="input"
            placeholder="Describe what's shown in the image..."
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps screen readers describe the image to visually impaired users
          </p>
        </div>
      )}

      {/* Upload Button (when no image) */}
      {!currentImageUrl && !uploading && (
        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className="btn-secondary w-full flex items-center justify-center space-x-2"
        >
          <ImageIcon className="h-4 w-4" />
          <span>Choose Image</span>
        </button>
      )}

      {/* Upload Progress */}
      {uploading && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          <span>Uploading image...</span>
        </div>
      )}

      {/* Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-800">Image Tips</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Use high-quality images that showcase your experience</li>
              <li>• Recommended size: 1200x800 pixels or similar aspect ratio</li>
              <li>• Avoid blurry or dark images</li>
              <li>• Include people or activities when possible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
