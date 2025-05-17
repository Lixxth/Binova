
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'

export default function HikPage() {
  const [prediction, setPrediction] = useState('Cargando...')
  const [imageSrc, setImageSrc] = useState('/api/hik')
  const router = useRouter()

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    const start = async () => {
      const model = await mobilenet.load()
      const interval = setInterval(() => {
        const url = `/api/hik?rand=${Math.random()}`
        img.src = url

        img.onload = async () => {
          const result = await model.classify(img)
          if (result.length > 0) {
            setPrediction(`${result[0].className} (${(result[0].probability * 100).toFixed(1)}%)`)
          }
        }

        setImageSrc(url)
      }, 2000)

      return () => clearInterval(interval)
    }

    start()
  }, [])

  const handleBack = () => {
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Cámara Hikvision</h1>
      <img src={imageSrc} alt="Hikvision" width={300} className="rounded shadow" />
      <p className="mt-4 text-lg">{prediction}</p>
      <button
        onClick={handleBack}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        🔙 Regresar al inicio
      </button>
    </div>
  )
}
