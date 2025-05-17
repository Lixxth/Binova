'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-300 text-gray-800">
      <h1 className="text-4xl font-bold mb-6">♻ Detector de Reciclaje Inteligente</h1>
      <p className="mb-10 text-center max-w-md">
        Selecciona una cámara para iniciar la detección de objetos reciclables como plástico, vidrio y cartón.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => router.push('/detector?cam=local')}
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700"
        >
          Usar cámara del dispositivo
        </button>
        <button
          onClick={() => router.push('/hikvision/stream')} // ✅ redirige directo al stream
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700"
        >
          Conectar cámara Hikvision
        </button>
      </div>
    </div>
  )
}