import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

function QRScanner() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Acceder a la cámara
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
        requestAnimationFrame(scanQR);
      })
      .catch((err) => {
        console.error('Error al acceder a la cámara:', err);
      });

    // Función para escanear el QR
    function scanQR() {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          setQrData(code.data);
          // Dibujar un rectángulo alrededor del QR (opcional)
          drawQRBorder(ctx, code.location);
        }
      }
      requestAnimationFrame(scanQR);
    }

    // Limpiar al desmontar el componente
    return () => {
      if (video.srcObject) {
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Función para dibujar el borde del QR
  function drawQRBorder(ctx, location) {
    ctx.beginPath();
    ctx.strokeStyle = 'lime';
    ctx.lineWidth = 4;
    ctx.moveTo(location.topLeftCorner.x, location.topLeftCorner.y);
    ctx.lineTo(location.topRightCorner.x, location.topRightCorner.y);
    ctx.lineTo(location.bottomRightCorner.x, location.bottomRightCorner.y);
    ctx.lineTo(location.bottomLeftCorner.x, location.bottomLeftCorner.y);
    ctx.closePath();
    ctx.stroke();
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Escáner de QR</h2>
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas ref={canvasRef} style={{ width: '100%', maxWidth: '400px' }} />
      {qrData && (
        <div>
          <h3>Contenido del QR:</h3>
          <p>{qrData}</p>
        </div>
      )}
    </div>
  );
}

export default QRScanner;