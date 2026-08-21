import type { ResumeAnalysisResponse } from "@/types/resume";


const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function analyzeResume(
  file: File,
  targetRole?: string,
  jobDescription?: string,
): Promise<ResumeAnalysisResponse> {
  const formData = new FormData();

  formData.append("file", file);

  if (targetRole?.trim()) {
    formData.append("target_role", targetRole.trim());
  }

  if (jobDescription?.trim()) {
    formData.append(
      "job_description",
      jobDescription.trim(),
    );
  }

  const response = await fetch(
    `${API_BASE_URL}/resume/analyze`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    throw new Error(
        "Failed to analyze resume. Please try again.",
    );
  }
  return response.json();
}