import ffmpeg from 'fluent-ffmpeg'
import axios from 'axios';

// Configuración de la cámara (ahora con URL HTTP/HTTPS)
const CAMERA_CONFIG = {
  snapshotUrl: 'http://192.168.0.64/ISAPI/Streaming/channels/101/picture',
  auth: {
    username: 'admin',
    password: '0987654321'
  }
};

export async function getHikvisionStream() {
  try {
    // 1. Opción para snapshot (imagen estática)
    const response = await axios.get(CAMERA_CONFIG.snapshotUrl, {
      responseType: 'arraybuffer',
      auth: CAMERA_CONFIG.auth
    });

    // Convertir a Buffer y luego a base64 para usar en el frontend
    const imageBase64 = Buffer.from(response.data, 'binary').toString('base64');
    return `data:image/jpeg;base64,${imageBase64}`;

  } catch (error) {
    console.error('Error al obtener stream:', error);
    throw new Error('No se pudo conectar a la cámara');
  }
}

// Uso alternativo para MJPEG stream (si la cámara lo soporta)
export function getHikvisionMJPGStream() {
  return {
    url: `http://${CAMERA_CONFIG.auth.username}:${CAMERA_CONFIG.auth.password}@192.168.0.64/ISAPI/Streaming/channels/101/httppreview`,
    contentType: 'multipart/x-mixed-replace;boundary=frame'
  };
}