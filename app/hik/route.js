import { NextResponse } from 'next/server'
import { getHikvisionStream } from '@/lib/hikvision'

export async function GET() {
  try {
    const streamUrl = await getHikvisionStream()
    return NextResponse.json({ url: streamUrl })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}