'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="h-full flex items-center justify-center flex-col space-y-4">
      <h2 className="text-2xl font-bold">Bir şeyler yanlış gitti!</h2>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        Tekrar dene
      </button>
    </div>
  )
}

