export interface ScamIndicator {
  category: string;
  evidence: string;
  explanation: string;
}

export interface FraudAssessmentReport {
  safety_score: number;
  risk_level: string;
  brand_impersonated: string;
  qr_link_extracted: string;
  psychological_trick: string;
  indicators_found: ScamIndicator[];
  action_advice: string;
}

export type ViewState = 'blank' | 'loading' | 'result';
