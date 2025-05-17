
'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'

export default function DetectorPage() {
  const searchParams = useSearchParams()
  const cam = searchParams.get('cam') // 'local' o 'hik'

  const videoRef = useRef(null)
  const [imageSrc, setImageSrc] = useState('')
  const [prediction, setPrediction] = useState('Detectando...')
  const [camLabel, setCamLabel] = useState('')

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'

    async function start() {
      const model = await mobilenet.load()

      if (cam === 'local') {
        setCamLabel('Cámara del dispositivo')
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        videoRef.current.srcObject = stream

        setInterval(async () => {
          const result = await model.classify(videoRef.current)
          if (result.length > 0) {
            setPrediction(`${result[0].className} (${(result[0].probability * 100).toFixed(1)}%)`)
          }
        }, 2000)
      } else if (cam === 'hik') {
        setCamLabel('Cámara Hikvision')
        setInterval(() => {
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
      }
    }

    start()
  }, [cam])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-semibold mb-4">{camLabel}</h1>

      {cam === 'local' ? (
        <video ref={videoRef} autoPlay muted playsInline width={320} className="rounded-lg shadow" />
      ) : (
        <img src={imageSrc} alt="Hikvision" width={320} className="rounded-lg shadow" />
      )}

      <div className="mt-6 text-lg text-center px-4 py-2 bg-white rounded-xl shadow-md max-w-xs">
        ♻️ <strong>Predicción:</strong> {prediction}
      </div>
    </div>
  )
}
