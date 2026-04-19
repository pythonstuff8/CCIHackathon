export type UserRole = 'teen' | 'parent' | 'counselor';
export type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

export interface User {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  onboarding_complete: boolean;
}

export interface JournalEntry {
  id: number;
  content: string;
  mood_before: number;
  created_at: string;
  updated_at: string;
  analysis?: RiskAnalysis;
}

export interface RiskAnalysis {
  id: number;
  risk_level: RiskLevel;
  risk_score: number;
  detected_themes: string[];
  supportive_message: string;
  summary_for_guardian: string;
  created_at: string;
}

export interface GuardianAnalysisView {
  risk_level: RiskLevel;
  risk_score: number;
  detected_themes: string[];
  summary_for_guardian: string;
  created_at: string;
}

export interface PHQ9Response {
  id: number;
  answers: number[];
  total_score: number;
  severity: string;
  question_9_flag: boolean;
  created_at: string;
}

export interface Alert {
  id: number;
  teen_id: number;
  recipient_email: string;
  alert_type: string;
  risk_level: RiskLevel;
  summary: string;
  is_read: boolean;
  created_at: string;
}

export interface TeenOverview {
  teen_id: number;
  username: string;
  latest_risk_level: RiskLevel;
  latest_risk_score: number;
  alert_count: number;
  last_checkin: string | null;
}

export interface CrisisResource {
  name: string;
  description: string;
  contact: string;
  type: string;
}
