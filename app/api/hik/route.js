
import { NextResponse } from 'next/server'

export async function GET() {
  const res = await fetch('http://admin:0987654321@@192.168.0.64/ISAPI/Streaming/channels/101/picture')
  const buffer = await res.arrayBuffer()

  return new NextResponse(Buffer.from(buffer), {
    status: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Cache-Control': 'no-store',
    },
  })
}
