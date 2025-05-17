'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'

export default function CamPage() {
  const videoRef = useRef(null)
  const [prediction, setPrediction] = useState('Cargando...')
  const router = useRouter()

  useEffect(() => {
    let stream
    const start = async () => {
      stream = await navigator.mediaDevices.getUserMedia({ video: true })
      videoRef.current.srcObject = stream

      const model = await mobilenet.load()
      const intervalId = setInterval(async () => {
        const result = await model.classify(videoRef.current)
        if (result.length > 0) {
          setPrediction(`${result[0].className} (${(result[0].probability * 100).toFixed(1)}%)`)
        }
      }, 1500)

      return () => clearInterval(intervalId)
    }

    start()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const handleBack = () => {
    const stream = videoRef.current?.srcObject
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Cámara del dispositivo</h1>
      <video ref={videoRef} autoPlay muted playsInline width={300} className="rounded shadow" />
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
