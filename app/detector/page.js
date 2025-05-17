'use client'

import { useEffect, useRef, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'

// Lista de objetos reciclables permitidos
const ALLOWED_OBJECTS = [
  'plastic',
  'glass',
  'paper',
  'cardboard',
  'metal',
  'bottle',
  'can',
  'container',
  'box',
  'tin',
  'aluminum',
  'steel',
  'battery',
  'chemical',
  'medicine',
  'paint',
  'oil',
  'electronic',
  'hazardous'
]

export default function DetectorPage() {
  const searchParams = useSearchParams()
  const cam = searchParams.get('cam') // 'local' o 'hik'

  const videoRef = useRef(null)
  const [imageSrc, setImageSrc] = useState('')
  const [prediction, setPrediction] = useState('Detectando...')
  const [camLabel, setCamLabel] = useState('')
  const [bgColor, setBgColor] = useState('bg-gray-100')
  const router = useRouter()

  // Función para verificar si el objeto detectado es reciclable
  const isRecyclable = (className) => {
    return ALLOWED_OBJECTS.some(obj => 
      className.toLowerCase().includes(obj.toLowerCase())
    )
  }

  // Función para obtener el color del fondo según la categoría
  const getBackgroundColor = (className) => {
    const lowerClassName = className.toLowerCase()
    
    if (lowerClassName.includes('battery') || lowerClassName.includes('chemical') || 
        lowerClassName.includes('medicine') || lowerClassName.includes('paint') || 
        lowerClassName.includes('oil') || lowerClassName.includes('electronic') || 
        lowerClassName.includes('hazardous')) {
      return 'bg-red-900'
    } else if (lowerClassName.includes('plastic') || lowerClassName.includes('metal') || 
        lowerClassName.includes('aluminum') || lowerClassName.includes('steel') || 
        lowerClassName.includes('tin') || lowerClassName.includes('can') ||
        (lowerClassName.includes('bottle') && !lowerClassName.includes('glass'))) {
      return 'bg-amber-400'
    } else if (lowerClassName.includes('paper') || lowerClassName.includes('cardboard') || 
               lowerClassName.includes('box')) {
      return 'bg-blue-900'
    } else if (lowerClassName.includes('glass')) {
      return 'bg-green-900'
    }
    return 'bg-gray-200'
  }

  // Función para obtener el color del contenedor según el tipo de material
  const getRecyclingBinColor = (className) => {
    const lowerClassName = className.toLowerCase()
    
    if (lowerClassName.includes('battery') || lowerClassName.includes('chemical') || 
        lowerClassName.includes('medicine') || lowerClassName.includes('paint') || 
        lowerClassName.includes('oil') || lowerClassName.includes('electronic') || 
        lowerClassName.includes('hazardous')) {
      return 'roja'
    } else if (lowerClassName.includes('plastic') || lowerClassName.includes('metal') || 
        lowerClassName.includes('aluminum') || lowerClassName.includes('steel') || 
        lowerClassName.includes('tin') || lowerClassName.includes('can') ||
        (lowerClassName.includes('bottle') && !lowerClassName.includes('glass'))) {
      return 'amarilla'
    } else if (lowerClassName.includes('paper') || lowerClassName.includes('cardboard') || 
               lowerClassName.includes('box')) {
      return 'azul'
    } else if (lowerClassName.includes('glass')) {
      return 'verde'
    }
    return null
  }

  // Función para traducir y formatear el nombre del objeto
  const formatObjectName = (className) => {
    const lowerClassName = className.toLowerCase()
    
    // Primero verificamos si es una botella de plástico
    if (lowerClassName.includes('bottle') && !lowerClassName.includes('glass')) {
      return 'Botella de Plástico'
    }

    const translations = {
      'plastic': 'Plástico',
      'glass': 'Vidrio',
      'paper': 'Papel',
      'cardboard': 'Cartón',
      'metal': 'Metal',
      'can': 'Lata',
      'container': 'Contenedor',
      'box': 'Caja',
      'tin': 'Lata',
      'aluminum': 'Aluminio',
      'steel': 'Acero',
      'battery': 'Batería',
      'chemical': 'Químico',
      'medicine': 'Medicamento',
      'paint': 'Pintura',
      'oil': 'Aceite',
      'electronic': 'Electrónico',
      'hazardous': 'Peligroso'
    }

    for (const [key, value] of Object.entries(translations)) {
      if (lowerClassName.includes(key)) {
        return value
      }
    }
    return className
  }

  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    let stream
    let predictionInterval

    async function start() {
      const model = await mobilenet.load()

      if (cam === 'local') {
        try {
          setCamLabel('Cámara del dispositivo')
          stream = await navigator.mediaDevices.getUserMedia({ video: true })
          
          if (stream && videoRef.current) {
            videoRef.current.srcObject = stream

            predictionInterval = setInterval(async () => {
              if (videoRef.current) {
                const result = await model.classify(videoRef.current)
                if (result.length > 0) {
                  const detectedObject = result[0].className
                  if (isRecyclable(detectedObject)) {
                    const formattedName = formatObjectName(detectedObject)
                    const binColor = getRecyclingBinColor(detectedObject)
                    setPrediction(`${formattedName} (${(result[0].probability * 100).toFixed(1)}%) - Se abrirá la puerta ${binColor}`)
                    setBgColor(getBackgroundColor(detectedObject))
                  } else {
                    setPrediction('No se detectó un objeto reciclable')
                    setBgColor('bg-gray-100')
                  }
                }
              }
            }, 2000)
          }
        } catch (error) {
          console.error('Error accessing camera:', error)
          setPrediction('Error al acceder a la cámara')
        }
      } else if (cam === 'hik') {
        setCamLabel('Cámara Hikvision')
        predictionInterval = setInterval(() => {
          const url = `/api/hik?rand=${Math.random()}`
          img.src = url
          img.onload = async () => {
            const result = await model.classify(img)
            if (result.length > 0) {
              const detectedObject = result[0].className
              if (isRecyclable(detectedObject)) {
                const formattedName = formatObjectName(detectedObject)
                const binColor = getRecyclingBinColor(detectedObject)
                setPrediction(`${formattedName} (${(result[0].probability * 100).toFixed(1)}%) - Se abrirá la puerta ${binColor}`)
                setBgColor(getBackgroundColor(detectedObject))
              } else {
                setPrediction('No se detectó un objeto reciclable')
                setBgColor('bg-gray-100')
              }
            }
          }
          setImageSrc(url)
        }, 2000)
      }
    }

    start()

    return () => {
      if (predictionInterval) {
        clearInterval(predictionInterval)
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [cam])

  const handleBack = () => {
    const stream = videoRef.current?.srcObject
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop()
        track.enabled = false
      })
      videoRef.current.srcObject = null
    }
    window.location.href = '/'
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors duration-500 ${bgColor}`}>
      <h1 className="text-3xl font-semibold mb-4">{camLabel}</h1>

      {cam === 'local' ? (
        <video ref={videoRef} autoPlay muted playsInline width={320} className="rounded-lg shadow" />
      ) : (
        <img src={imageSrc} alt="Hikvision" width={320} className="rounded-lg shadow" />
      )}

      <div className="mt-6 text-lg text-center px-4 py-2 bg-white rounded-xl shadow-md max-w-xs">
        ♻️ <strong>Predicción:</strong> {prediction}
      </div>

      <div className="mt-4 text-center px-4 py-2 bg-white rounded-xl shadow-md max-w-xs">
        <p className="text-sm text-gray-700">
          <strong>Instrucciones de reciclaje:</strong>
        </p>
        <p className="text-sm text-gray-600">
          • Puerta <span className="text-red-600 font-bold">roja</span>: Desechos peligrosos<br />
          • Puerta <span className=" text-amber-400 font-bold">amarilla</span>: Plástico y metal<br />
          • Puerta <span className="text-blue-600 font-bold">azul</span>: Papel y cartón<br />
          • Puerta <span className="text-green-600 font-bold">verde</span>: Vidrio
        </p>
      </div>

      <button
        onClick={handleBack}
        className="mt-6 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        🔙 Cerrar cámara y volver al inicio
      </button>
    </div>
  )
}
