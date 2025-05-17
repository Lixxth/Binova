'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-300 text-gray-800">
      <div className="mb-8">
        <Image
          src="/logo.jpg"
          alt="Logo Reciclaje Inteligente"
          width={200}
          height={200}
          className="rounded-full shadow-lg"
          priority
        />
      </div>

      <h1 className="text-4xl font-bold mb-6">♻ Detector de Reciclaje Inteligente</h1>
      <p className="mb-10 text-center max-w-md">
        Selecciona una cámara para iniciar la detección de objetos reciclables como plástico, vidrio y cartón.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button
          onClick={() => router.push('/detector?cam=local')}
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          Demo de detector - Cámara local
        </button>
        <button
          onClick={() => router.push('/hikvision/stream')}
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Demo de detector - Cámara Hikvision
        </button>
      </div>
    </div>
  )
}