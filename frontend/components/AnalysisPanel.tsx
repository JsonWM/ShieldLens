'use client';

import { FraudAssessmentReport, ScamIndicator } from './Types';

interface AnalysisPanelProps {
  viewState: 'blank' | 'loading' | 'result';
  analysisReport: FraudAssessmentReport;
}

export default function AnalysisPanel({ viewState, analysisReport }: AnalysisPanelProps) {
  const resolveRiskStateModifierClass = (riskLevel: string) => {
    const standardized = riskLevel ? riskLevel.toUpperCase().trim() : '';
    if (standardized === 'DANGER' || standardized === 'PELIGRO') return 'risk-danger';
    if (standardized === 'WARNING' || standardized === 'PRECAUCIÓN' || standardized === 'PRECAUCION') return 'risk-warning';
    if (standardized === 'SAFE' || standardized === 'SEGURO') return 'risk-safe';
    return 'risk-warning';
  };

  const resolveNestedBulletHexMarkerColor = (riskLevel: string) => {
    const standardized = riskLevel ? riskLevel.toUpperCase().trim() : '';
    if (standardized === 'DANGER' || standardized === 'PELIGRO') return '#d90429';
    if (standardized === 'SAFE' || standardized === 'SEGURO') return '#38b000';
    return '#f77f00';
  };

  return (
    <section>
      <h2 className="sec-title">02. Analysis</h2>

      {viewState === 'blank' && (
        <div className="state-container">
          <p>System ready. Awaiting file or link submission.</p>
        </div>
      )}

      {viewState === 'loading' && (
        <div className="state-container">
          <div className="spinner"></div>
          <p style={{ color: '#000000', fontWeight: 'bold' }}>Analyzing telemetry context markers...</p>
        </div>
      )}

      {viewState === 'result' && (
        <div className="space-y-6">
          <div className={`risk-header ${resolveRiskStateModifierClass(analysisReport.risk_level)}`}>
            <div>
              <span className="score-lbl">Confidence</span>
              <span className="score-val">{analysisReport.safety_score}<span className="score-sub">/100</span></span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className="score-lbl">Risk Rating</span>
              <span className="level-val">{analysisReport.risk_level}</span>
            </div>
          </div>

          <div className="meta-grid">
            <div className="meta-box">
              <span className="meta-lbl">Target Entity:</span>
              <span className="meta-val">{analysisReport.brand_impersonated}</span>
            </div>
            <div className="meta-box">
              <span className="meta-lbl">Extracted Link/QR:</span>
              <span className="meta-val-qr" title={analysisReport.qr_link_extracted}>{analysisReport.qr_link_extracted}</span>
            </div>
          </div>

          <div className="card-box">
            <h3 className="card-title">Behavioral Vectors & Urgency Analysis:</h3>
            <p className="card-text">{analysisReport.psychological_trick}</p>
          </div>

          <div>
            <h3 className="sec-title" style={{ marginBottom: '0.5rem' }}>Detected Indicators:</h3>
            <div className="ind-list">
              {analysisReport.indicators_found?.map((indicatorNode: ScamIndicator, loopIndex: number) => (
                <div key={loopIndex} className="ind-item">
                  <div 
                    className="ind-dot" 
                    style={{ backgroundColor: resolveNestedBulletHexMarkerColor(analysisReport.risk_level) }}
                  ></div>
                  <div>
                    <h4 className="ind-title">{indicatorNode.category}</h4>
                    <p className="ind-ev">Evidence: "{indicatorNode.evidence}"</p>
                    <p className="ind-desc">{indicatorNode.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="action-box">
            <h4 className="action-title">Final Verdict:</h4>
            <p className="action-text">{analysisReport.action_advice}</p>
          </div>
        </div>
      )}
    </section>
  );
}
