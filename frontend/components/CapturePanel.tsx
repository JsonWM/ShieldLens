'use client';

import { useRef, DragEvent, ChangeEvent } from 'react';

interface CapturePanelProps {
  viewState: string;
  imagePreviewSrc: string;
  isUrlTextDetected: boolean;
  pastedUrlString: string;
  isDragHoverActive: boolean;
  onDragStateChange: (active: boolean) => void;
  onDropped: (event: DragEvent<HTMLDivElement>) => void;
  onFileSelected: (file: File) => void;
  onClear: () => void;
}

export default function CapturePanel({
  viewState,
  imagePreviewSrc,
  isUrlTextDetected,
  pastedUrlString,
  isDragHoverActive,
  onDragStateChange,
  onDropped,
  onFileSelected,
  onClear
}: CapturePanelProps) {
  const nativeFileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      onDragStateChange(true);
    } else if (e.type === 'dragleave') {
      onDragStateChange(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <section style={{ position: 'relative' }}>
      <h2 className="sec-title">01. Capture</h2>
      <p className="sec-desc">Upload document, paste text URL link, or drag an asset directly.</p>

      <div 
        className="dropzone-horizontal"
        style={{ 
          backgroundColor: isDragHoverActive ? '#f5f5f5' : '#ffffff',
          borderStyle: isDragHoverActive ? 'solid' : 'dashed'
        }}
        onClick={() => nativeFileInputRef.current?.click()}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={onDropped}
      >
        <input 
          type="file" 
          ref={nativeFileInputRef} 
          accept="image/*" 
          style={{ display: 'none' }} 
          onChange={handleInputChange}
        />

        {viewState === 'blank' && !imagePreviewSrc && !isUrlTextDetected && (
          <div className="prompt-horizontal">
            <span className="drop-text">Click to upload, press Ctrl + V, or paste URL</span>
            <span className="drop-sub">[IMAGE or LINK]</span>
          </div>
        )}

        {imagePreviewSrc && !isUrlTextDetected && (
          <img id="previewImage" src={imagePreviewSrc} alt="Telemetry Canvas Anchor" />
        )}

        {isUrlTextDetected && (
          <div className="url-preview-box">
            <strong>[ DIRECT URL MARKER DETECTED ]</strong>
            <p style={{ marginTop: '0.25rem', fontFamily: 'monospace' }}>{pastedUrlString}</p>
          </div>
        )}

        {(imagePreviewSrc || isUrlTextDetected) && (
          <button 
            id="clearButton"
            onClick={(e) => {
              e.stopPropagation();
              onClear();
            }}
          >
            [ CLEAR ]
          </button>
        )}
      </div>
    </section>
  );
}
