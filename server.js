// server.js
const express = require('express')
const { spawn } = require('child_process')
const cors = require('cors')

const app = express()
app.use(cors())

// 🔧 Modifica esta línea con tu usuario, contraseña e IP reales
const RTSP_URL = 'rtsp://admin:0987654321@@192.168.0.64:554/Streaming/Channels/101'

app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    Pragma: 'no-cache',
  })

  const ffmpeg = spawn('ffmpeg', [
    '-i', RTSP_URL,
    '-f', 'mjpeg',
    '-q', '5',
    '-r', '10',
    '-an',
    '-' // Output a stdout
  ])

  ffmpeg.stdout.on('data', (data) => {
    res.write('--frame\r\nContent-Type: image/jpeg\r\nContent-Length: ${data.length}\r\n\r\n')
    res.write(data)
  })

  ffmpeg.stderr.on('data', (data) => {
    console.error('FFmpeg stderr:', data.toString())
  })

  req.on('close', () => {
    ffmpeg.kill('SIGTERM')
  })
})

const PORT = 8080
app.listen(PORT, () => {
  console.log('🟢 Streaming en vivo disponible en http://localhost:${PORT}/stream')
})