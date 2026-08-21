export interface ResumeAnalysisResponse {
  filename: string;
  resume_analysis: Record<string, unknown>;
  ats_analysis: Record<string, unknown>;
  ai_analysis: Record<string, unknown>;
}