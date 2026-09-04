"use client";

import { useEffect, useState } from "react";
import AtsScore from "@/components/results/AtsScore";
import AtsBreakdown from "@/components/results/AtsBreakdown";
import SkillsMatch from "@/components/results/SkillsMatch";
import ResumeOverview from "@/components/results/ResumeOverview";
import AiAssessment from "@/components/results/AiAssessment";
import ExperienceProjects from "@/components/results/ExperienceProjects";
import EducationCertifications from "@/components/results/EducationCertifications";
import OptimizationTips from "@/components/results/OptimizationTips";
import ResultsHeader from "@/components/results/ResultsHeader";
import PriorityImprovements from "@/components/results/PriorityImprovements";
import type { ResumeAnalysisResponse } from "@/types/resume";

export default function ResultsPage() {
  const [result, setResult] =
    useState<ResumeAnalysisResponse | null>(null);

  useEffect(() => {
    const storedResult =
      sessionStorage.getItem("resumeAnalysis");

    if (!storedResult) {
      return;
    }

    try {
      const parsedResult: ResumeAnalysisResponse =
        JSON.parse(storedResult);

      setResult(parsedResult);
    } catch (error) {
      console.error(
        "Failed to read analysis result:",
        error,
      );
    }
  }, []);

  if (!result) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-4xl font-bold text-gray-900">
            No analysis found
          </h1>

          <p className="mt-3 text-gray-600">
            Please analyze a resume first.
          </p>
        </div>
      </main>
    );
  }
    // console.log("FULL RESULT:", result);
    // console.log("PRIORITY IMPROVEMENTS:",result.priority_improvements);
  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <ResultsHeader
        filename={result.filename}
        targetRole={result.resume_analysis.target_role}
      />

      <div className="mx-auto max-w-5xl px-6 py-10">

        {/* 1. ATS Score */}
        <div className="mt-8">
          <AtsScore
            score={result.ats_analysis.ats_score}
            maxScore={result.ats_analysis.max_score}
          />
        </div>

        {/* 2. ATS Breakdown */}
        <div className="mt-6">
          <AtsBreakdown
            breakdown={result.ats_analysis.breakdown}
          />
        </div>

        {/* 3. Skills Match */}
        <div className="mt-6">
          <SkillsMatch
            matchedKeywords={
              result.ats_analysis.matched_keywords
            }
            missingKeywords={
              result.ats_analysis.missing_keywords
            }
          />
        </div>
        <div className="mt-6">
            <PriorityImprovements
              improvements={result.priority_improvements}
            />
        </div>
        {/* 4. Resume Overview */}
        <div className="mt-6">
          <ResumeOverview
            candidate={result.resume_analysis.candidate}
            targetRole={result.resume_analysis.target_role}
            experience={result.resume_analysis.experience}
            skills={result.resume_analysis.skills}
          />
        </div>

        {/* 5. AI Assessment */}
        <div className="mt-6">
          <AiAssessment
            overallAssessment={
              result.ai_analysis.overall_assessment
            }
            strengths={result.ai_analysis.strengths}
            weaknesses={result.ai_analysis.weaknesses}
            suggestions={result.ai_analysis.suggestions}
          />
        </div>

        {/* 6. Experience & Projects */}
        <div className="mt-6">
          <ExperienceProjects
            projects={result.resume_analysis.projects}
            experience={result.resume_analysis.experience}
          />
        </div>

        {/* 7. Education & Certifications */}
        <div className="mt-6">
          <EducationCertifications
            education={result.resume_analysis.education}
            certifications={
              result.resume_analysis.certifications
            }
          />
        </div>

        {/* 8. Optimization Tips */}
        <div className="mt-6">
          <OptimizationTips
            tips={
              result.ai_analysis.ats_optimization_tips
            }
            missingInformation={
              result.ai_analysis.missing_information
            }
          />
        </div>

      </div>
    </main>
  );
}
