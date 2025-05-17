'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-200 to-blue-300 text-gray-800 p-4 sm:p-8">
      <div className="w-full max-w-4xl mx-auto">
        {/* Logo Section */}
        <div className="flex justify-center mb-6 sm:mb-8">
          <div className="relative w-32 h-32 sm:w-48 sm:h-48">
            <Image
              src="/logo.jpg"
              alt="Logo Reciclaje Inteligente"
              fill
              className="rounded-full shadow-lg object-cover"
              priority
            />
          </div>
        </div>

        {/* Title Section */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-bold mb-4">
            ♻ Detector de Reciclaje Inteligente
          </h1>
          <p className="text-sm sm:text-base text-gray-700 max-w-md mx-auto">
            Selecciona una cámara para iniciar la detección de objetos reciclables como plástico, vidrio y cartón.
          </p>
        </div>

        {/* Buttons Section */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-md mx-auto">
          <button
            onClick={() => router.push('/detector?cam=local')}
            className="w-full bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-colors text-sm sm:text-base"
          >
            Demo de detector - Cámara local
          </button>
          <button
            onClick={() => router.push('/hikvision/stream')}
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Demo de detector - Cámara Hikvision
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-xs sm:text-sm text-gray-600">
          <p>© 2024 Reciclaje Inteligente</p>
        </div>
      </div>
    </div>
  )
}