'use client';

import { RefObject } from 'react';

interface CameraOverlayProps {
  isOpen: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onCapture: () => void;
  onClose: () => void;
}

export default function CameraOverlay({
  isOpen,
  videoRef,
  canvasRef,
  onCapture,
  onClose
}: CameraOverlayProps) {
  if (!isOpen) return null;

  return (
    <div 
      id="cameraOverlay" 
      style={{
        position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
        background: 'rgba(255,255,255,0.98)', zIndex: 100, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
      }}
    >
      <h3 style={{ fontFamily: 'monospace', fontSize: '1.1rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '1rem', color: '#000000', letterSpacing: '0.5px' }}>
        [ CAMERA STREAM VIEWER ]
      </h3>
      
      <video 
        ref={videoRef}
        autoPlay 
        playsInline 
        style={{ width: '90%', maxWidth: '700px', height: 'auto', border: '2px solid #000000', background: '#000000', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}
      ></video>
      
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1.5rem', width: '90%', maxWidth: '700px', justifyContent: 'center' }}>
        <button 
          id="snapPhotoButton" 
          style={{ padding: '0.65rem 1.25rem', background: '#ffffff', border: '2px solid #000000', color: '#000000', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={onCapture}
        >
          [ SNAP PHOTO ]
        </button>
        <button 
          id="closeCamButton" 
          style={{ padding: '0.65rem 1.25rem', background: '#ffffff', border: '2px solid #000000', color: '#000000', fontFamily: 'monospace', fontSize: '0.95rem', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={onClose}
        >
          [ CANCEL ]
        </button>
      </div>
    </div>
  );
}
