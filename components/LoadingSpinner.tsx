interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
  // Return empty div to remove loading spinner
  return <div></div>
}

