'use client';

import { useRef, DragEvent, ChangeEvent } from 'react';

interface DropzoneAreaProps {
    viewState: string;
    imagePreviewSrc: string;
    isUrlTextDetected: boolean;
    pastedUrlString: string;
    isDragHoverActive: boolean;
    onDragStateChange: (active: boolean) => void;
    onDropped: (event: DragEvent<HTMLDivElement>) => void;
    onFileSelected: (files: FileList) => void;
    onClear: () => void;
}


export default function DropzoneArea({
    viewState,
    imagePreviewSrc,
    isUrlTextDetected,
    pastedUrlString,
    isDragHoverActive,
    onDragStateChange,
    onDropped,
    onFileSelected,
    onClear
}: DropzoneAreaProps) {
    const nativeFileInputRef = useRef<HTMLInputElement>(null);

    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.type === 'dragenter' || event.type === 'dragover') {
            onDragStateChange(true);
        } else if (event.type === 'dragleave') {
            onDragStateChange(false);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            onFileSelected(event.target.files);
        }
    };


    return (
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
    );
}
