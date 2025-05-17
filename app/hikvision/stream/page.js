'use client'

import { useEffect, useState } from 'react'

export default function HikvisionStreamPage() {
  const [isClient, setIsClient] = useState(false)
  const [src, setSrc] = useState('')

  useEffect(() => {
    setIsClient(true)
    const interval = setInterval(() => {
      setSrc('http://localhost:8080/stream?cacheBust=${Date.now()}')
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!isClient) return null // Previene error de hidratación

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <h1 className="text-white text-xl mb-4">📡 Stream en vivo desde Hikvision</h1>
      <img
        src={src}
        alt="Live Hikvision Stream"
        className="max-w-xl w-full border-2 border-white rounded shadow"
      />
    </div>
  )
}