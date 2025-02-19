interface ErrorMessageProps {
  message: string
}

const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="text-center py-12">
      <div className="mb-4">
        <svg 
          className="mx-auto h-12 w-12 text-red-600" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
          />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Noe gikk galt
      </h2>
      <p className="text-gray-600">
        {message}
      </p>
    </div>
  )
}

export default ErrorMessage 