
import { NextResponse } from 'next/server'

export async function GET() {
  const username = 'admin'
  const password = '0987654321@'
const base64 = Buffer.from('${username}:${password}').toString('base64')
  try {
    const res = await fetch('http://192.168.0.64/ISAPI/Streaming/channels/101/picture', {
      headers: {
        Authorization: 'Basic ${base64}'
      }
    })

    const buffer = await res.arrayBuffer()

    return new NextResponse(Buffer.from(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'no-store'
      }
    })
  } catch (error) {
    console.error('Error al obtener snapshot:', error)
    return new NextResponse('Error conectando con la cámara', { status: 500 })
  }
}