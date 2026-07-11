'use client';

import { useState, useEffect, DragEvent } from 'react';
import { FraudAssessmentReport, ViewState } from '@/components/Types';
import CapturePanel from '@/components/CapturePanel';
import AnalysisPanel from '@/components/AnalysisPanel';

const BACKEND_URL = 'http://localhost:8000/api/v1/shield-scan';

export default function ShieldLensDashboard() {
  const [viewState, setViewState] = useState<ViewState>('blank');
  const [imagePreviewSrc, setImagePreviewSrc] = useState<string>('');
  const [isUrlTextDetected, setIsUrlTextDetected] = useState<boolean>(false);
  const [pastedUrlString, setPastedUrlString] = useState<string>('');
  const [isDragHoverActive, setIsDragHoverActive] = useState<boolean>(false);
  
  const [analysisReport, setAnalysisReport] = useState<FraudAssessmentReport>({
    safety_score: 0, risk_level: '-', brand_impersonated: '-',
    qr_link_extracted: '-', psychological_trick: '-', indicators_found: [], action_advice: '-'
  });

  useEffect(() => {
    const interceptClipboardPaste = async (event: any) => {
      const clipboardData = event.clipboardData || (window as any).clipboardData;
      if (!clipboardData) return;
      const clipboardItems = clipboardData.items;
      
      for (let i = 0; i < clipboardItems.length; i++) {
        if (clipboardItems[i].type.indexOf('image') !== -1) {
          const file = clipboardItems[i].getAsFile();
          if (file) executePipelineRouting(file, 'file');
          break;
        } else if (clipboardItems[i].type === 'text/plain') {
          clipboardItems[i].getAsString((rawText: string) => {
            const cleaned = rawText.trim();
            if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
              executePipelineRouting(cleaned, 'text-url');
            }
          });
          break;
        }
      }
    };
    document.addEventListener('paste', interceptClipboardPaste);
    return () => document.removeEventListener('paste', interceptClipboardPaste);
  }, []);

  const executePipelineRouting = async (targetPayload: File | string, type: 'file' | 'text-url' | 'url') => {
    setViewState('loading');
    
    if (type === 'file' && typeof targetPayload !== 'string') {
      setIsUrlTextDetected(false);
      setImagePreviewSrc(URL.createObjectURL(targetPayload));
      try {
        const formData = new FormData();
        formData.append('file', targetPayload);
        const res = await fetch(BACKEND_URL, { method: 'POST', body: formData });
        setAnalysisReport(await res.json());
        setViewState('result');
      } catch {
        triggerCanvasWipeCleanup();
      }
    } 
    else if (type === 'text-url' && typeof targetPayload === 'string') {
      setIsUrlTextDetected(true);
      setPastedUrlString(targetPayload);
      setImagePreviewSrc('');
      try {
        const formData = new FormData();
        formData.append('direct_url', targetPayload);
        const res = await fetch(BACKEND_URL, { method: 'POST', body: formData });
        setAnalysisReport(await res.json());
        setViewState('result');
      } catch {
        triggerCanvasWipeCleanup();
      }
    }
  };

  const processDroppedTelemetry = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragHoverActive(false);
    const dt = event.dataTransfer;
    if (!dt) return;
    
    if (dt.files && dt.files.length > 0) {
      if (dt.files[0].type.startsWith('image/')) executePipelineRouting(dt.files[0], 'file');
    } else {
      const explicitPlainTextStr = dt.getData('text/plain').trim();
      if (explicitPlainTextStr.startsWith('http://') || explicitPlainTextStr.startsWith('https://')) {
        executePipelineRouting(explicitPlainTextStr, 'text-url');
      }
    }
  };

  const triggerCanvasWipeCleanup = () => {
    setImagePreviewSrc('');
    setIsUrlTextDetected(false);
    setPastedUrlString('');
    setViewState('blank');
  };

  return (
    <div className="container">
      <header>
        <h1 className="logo-title">ShieldLens</h1>
      </header>
      <main className="main-stack">
        <CapturePanel 
          viewState={viewState}
          imagePreviewSrc={imagePreviewSrc}
          isUrlTextDetected={isUrlTextDetected}
          pastedUrlString={pastedUrlString}
          isDragHoverActive={isDragHoverActive}
          onDragStateChange={setIsDragHoverActive}
          onDropped={processDroppedTelemetry}
          onFileSelected={(file) => executePipelineRouting(file, 'file')}
          onClear={triggerCanvasWipeCleanup}
        />
        <AnalysisPanel viewState={viewState} analysisReport={analysisReport} />
      </main>
    </div>
  );
}
