'use client';

import { DragEvent, RefObject } from 'react';
import DropzoneArea from './DropzoneArea';
import CameraOverlay from './CameraOverlay';

interface CapturePanelProps {
  viewState: string;
  imagePreviewSrc: string;
  isUrlTextDetected: boolean;
  pastedUrlString: string;
  isDragHoverActive: boolean;
  isCameraOpen: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  onDragStateChange: (active: boolean) => void;
  onDropped: (event: DragEvent<HTMLDivElement>) => void;
  onFileSelected: (files: FileList) => void;
  onClear: () => void;
  onTriggerCamera: () => void;
  onCaptureSnapshot: () => void;
  onCloseCamera: () => void;
}

export default function CapturePanel({
  viewState,
  imagePreviewSrc,
  isUrlTextDetected,
  pastedUrlString,
  isDragHoverActive,
  isCameraOpen,
  videoRef,
  canvasRef,
  onDragStateChange,
  onDropped,
  onFileSelected,
  onClear,
  onTriggerCamera,
  onCaptureSnapshot,
  onCloseCamera
}: CapturePanelProps) {
  return (
    <section style={{ position: 'relative', paddingTop: '1.5rem' }}>
      {/* Absolute floating operational trigger placed at top right corner */}
      <button 
        id="openCamButton" 
        style={{
          position: 'absolute', top: '1.5rem', right: '1.75rem',
          padding: '0.25rem 0.5rem', background: '#ffffff', border: '2px solid #000000',
          color: '#000000', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 'bold',
          cursor: 'pointer', zIndex: 20
        }}
        onClick={(e) => {
          e.stopPropagation();
          onTriggerCamera();
        }}
      >
        [ USE CAMERA ]
      </button>

      <h2 className="sec-title">01. Capture</h2>
      <p className="sec-desc" style={{ maxWidth: '80%' }}>Upload document, paste text URL link, or drag an asset directly.</p>

      {/* Render Decoupled Atomic Dropzone Input Workspace */}
      <DropzoneArea 
        viewState={viewState}
        imagePreviewSrc={imagePreviewSrc}
        isUrlTextDetected={isUrlTextDetected}
        pastedUrlString={pastedUrlString}
        isDragHoverActive={isDragHoverActive}
        onDragStateChange={onDragStateChange}
        onDropped={onDropped}
        onFileSelected={onFileSelected}
        onClear={onClear}
      />

      {/* Render Decoupled Isolated Hardware Camera Portal Overlay */}
      <CameraOverlay 
        isOpen={isCameraOpen}
        videoRef={videoRef}
        canvasRef={canvasRef}
        onCapture={onCaptureSnapshot}
        onClose={onCloseCamera}
      />
    </section>
  );
}
