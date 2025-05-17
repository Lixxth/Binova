const express = require('express')
const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = 8080

const outputDir = path.join(__dirname, 'hls')

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir)

// Lanza ffmpeg para convertir RTSP a HLS
const ffmpeg = spawn('ffmpeg', [
  '-rtsp_transport', 'tcp',
  '-i', 'rtsp://admin:0987654321@@192.168.0.64:554/Streaming/Channels/101',
  '-c:v', 'libx264',
  '-preset', 'veryfast',
  '-tune', 'zerolatency',
  '-f', 'hls',
  '-hls_time', '2',
  '-hls_list_size', '5',
  '-hls_flags', 'delete_segments',
  path.join(outputDir, 'stream.m3u8')
])

ffmpeg.stderr.on('data', data => console.error('[FFmpeg]', data.toString()))
ffmpeg.on('exit', () => console.log('FFmpeg process exited.'))

// Servir archivos HLS
app.use('/hls', express.static(outputDir))

app.listen(PORT, () => {
  console.log('🟢 HLS server ready on http://localhost:${PORT}/hls/stream.m3u8')
})