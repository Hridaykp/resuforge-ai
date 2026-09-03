"use client";

import { useState } from "react";
import { analyzeResume } from "@/lib/api";
import { useRouter } from "next/navigation";

const analysisStages = [
  "Uploading resume",
  "Reading resume content",
  "Extracting information",
  "Analyzing experience",
  "Identifying skills",
  "Checking ATS compatibility",
  "Matching job keywords",
  "Generating AI insights",
  "Finalizing your report",
];

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStage, setCurrentStage] = useState(0);

  const router = useRouter();

  const validateForm = (): boolean => {
    setError("");

    if (!file) {
      setError("Please upload your resume.");
      return false;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF or DOCX file.");
      return false;
    }

    const maxFileSize = 5 * 1024 * 1024; // 5 MB

    if (file.size > maxFileSize) {
      setError("Resume file must be smaller than 5 MB.");
      return false;
    }

    return true;
  };

  const handleAnalyze = async () => {
    const isValid = validateForm();

    if (!isValid || !file) {
      return;
    }

    setIsAnalyzing(true);
    setCurrentStage(0);
    setError("");

    /*
     * This interval controls the visual progress stages.
     * Your actual API request continues independently.
     */
    const stageInterval = setInterval(() => {
      setCurrentStage((previousStage) => {
        if (previousStage < analysisStages.length - 1) {
          return previousStage + 1;
        }

        return previousStage;
      });
    }, 1200);

    try {
      const result = await analyzeResume(
        file,
        targetRole,
        jobDescription
      );

      clearInterval(stageInterval);

      // Show the final stage briefly before moving to results.
      setCurrentStage(analysisStages.length - 1);

      sessionStorage.setItem(
        "resumeAnalysis",
        JSON.stringify(result)
      );

      setTimeout(() => {
        router.push("/results");
      }, 700);

    } catch (error) {
      clearInterval(stageInterval);

      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while analyzing your resume."
      );

      setIsAnalyzing(false);
      setCurrentStage(0);
    }
  };

  /*
   * ---------------------------------------------------------
   * ANALYZING SCREEN
   * ---------------------------------------------------------
   */

  if (isAnalyzing) {
    const progress = Math.min(
      Math.round(
        ((currentStage + 1) / analysisStages.length) * 100
      ),
      99
    );

    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6">

        <div className="w-full max-w-xl">

          {/* Logo */}
          <div className="text-center mb-8">
            <a
              href="/"
              className="text-2xl font-bold tracking-tight text-gray-900"
            >
              ResuForge<span className="text-blue-600">.AI</span>
            </a>
          </div>

          {/* Analysis Card */}
          <div className="rounded-2xl border border-gray-200 bg-white p-8 md:p-10 shadow-sm">

            {/* Resume scanning illustration */}
            <div className="flex justify-center mb-8">
              <div className="relative h-36 w-28">

                {/* Resume */}
                <div className="absolute inset-0 overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-4 shadow-sm">

                  {/* Resume heading */}
                  <div className="h-2 w-12 rounded bg-gray-800" />

                  {/* Resume lines */}
                  <div className="mt-4 space-y-2">
                    <div className="h-1.5 rounded bg-gray-200" />
                    <div className="h-1.5 w-4/5 rounded bg-gray-200" />
                    <div className="h-1.5 rounded bg-gray-200" />
                    <div className="h-1.5 w-3/4 rounded bg-gray-200" />

                    <div className="pt-2">
                      <div className="h-1.5 rounded bg-gray-200" />
                      <div className="mt-2 h-1.5 w-5/6 rounded bg-gray-200" />
                      <div className="mt-2 h-1.5 w-2/3 rounded bg-gray-200" />
                    </div>

                    <div className="pt-2">
                      <div className="h-1.5 rounded bg-gray-200" />
                      <div className="mt-2 h-1.5 w-4/5 rounded bg-gray-200" />
                    </div>
                  </div>

                  {/* Scanning line */}
                  <div className="absolute left-0 right-0 top-0 h-0.5 bg-blue-500 shadow-[0_0_10px_2px_rgba(59,130,246,0.45)] animate-scan" />
                </div>

                {/* AI badge */}
                <div className="absolute -bottom-3 -right-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-xl text-white shadow-lg">
                  ✦
                </div>
              </div>
            </div>

            {/* Heading */}
            <div className="text-center">

              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Your resume is being analyzed
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                ResuForge.AI is checking your resume for ATS
                compatibility, skills, experience, and areas for
                improvement.
              </p>

            </div>

            {/* Progress */}
            <div className="mt-8">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-sm font-medium text-gray-700">
                  Analysis progress
                </span>

                <span className="text-sm font-semibold text-blue-600">
                  {progress}%
                </span>

              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">

                <div
                  className="h-full rounded-full bg-blue-600 transition-all duration-700 ease-out"
                  style={{
                    width: `${progress}%`,
                  }}
                />

              </div>

            </div>

            {/* Analysis stages */}
            <div className="mt-8 space-y-3">

              {analysisStages.map((stage, index) => {

                const isComplete = index < currentStage;
                const isCurrent = index === currentStage;

                return (
                  <div
                    key={stage}
                    className={`flex items-center gap-3 transition-colors duration-300 ${
                      isCurrent
                        ? "text-gray-900"
                        : isComplete
                        ? "text-gray-600"
                        : "text-gray-400"
                    }`}
                  >

                    {/* Status icon */}
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center">

                      {isComplete ? (

                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs text-white">
                          ✓
                        </div>

                      ) : isCurrent ? (

                        <div className="relative h-5 w-5">

                          <div className="absolute inset-0 rounded-full border-2 border-blue-100" />

                          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-blue-600" />

                        </div>

                      ) : (

                        <div className="h-2 w-2 rounded-full bg-gray-300" />

                      )}

                    </div>

                    {/* Stage text */}
                    <span
                      className={`text-sm ${
                        isCurrent
                          ? "font-semibold"
                          : isComplete
                          ? "font-medium"
                          : ""
                      }`}
                    >
                      {stage}
                    </span>

                    {/* Working indicator */}
                    {isCurrent && (
                      <span className="ml-auto text-xs font-medium text-blue-600">
                        Working...
                      </span>
                    )}

                  </div>
                );
              })}

            </div>

            {/* Footer */}
            <div className="mt-8 border-t border-gray-100 pt-6 text-center">

              <p className="text-xs text-gray-400">
                This usually takes a few seconds. Please don't
                close or refresh this page.
              </p>

            </div>

          </div>

          {/* Security message */}
          <p className="mt-5 text-center text-xs text-gray-400">
            Your resume is processed securely.
          </p>

        </div>

        {/* Scan animation */}
        <style jsx global>{`
          @keyframes scan {
            0% {
              top: 0%;
              opacity: 0;
            }

            10% {
              opacity: 1;
            }

            50% {
              opacity: 1;
            }

            90% {
              opacity: 1;
            }

            100% {
              top: 100%;
              opacity: 0;
            }
          }

          .animate-scan {
            animation: scan 2s ease-in-out infinite;
          }
        `}</style>

      </main>
    );
  }

  /*
   * ---------------------------------------------------------
   * NORMAL UPLOAD SCREEN
   * ---------------------------------------------------------
   */

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="border-b border-gray-200 bg-white">

        <div className="mx-auto max-w-7xl px-6 py-5">

          <a
            href="/"
            className="text-2xl font-bold tracking-tight text-gray-900"
          >
            ResuForge<span className="text-blue-600">.AI</span>
          </a>

        </div>

      </header>

      {/* Main Content */}
      <section className="mx-auto max-w-3xl px-6 py-16">

        <div className="text-center">

          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Analyze your resume
          </h1>

          <p className="mt-4 text-lg text-gray-600">
            Upload your resume and optionally provide a target role
            or job description for a more relevant analysis.
          </p>

        </div>

        {/* Upload Card */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            1. Upload your resume
          </h2>

          <div className="mt-5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30">

            <div className="text-4xl">
              📄
            </div>

            <p className="mt-4 font-medium text-gray-900">
              Drop your resume here
            </p>

            <p className="mt-2 text-sm text-gray-500">
              or click to choose a file
            </p>

            <p className="mt-3 text-xs text-gray-400">
              PDF or DOCX
            </p>

            <input
              type="file"
              accept=".pdf,.docx"
              onChange={(event) => {
                const selectedFile =
                  event.target.files?.[0] ?? null;

                setFile(selectedFile);
                setError("");
              }}
              className="mt-6 block w-full cursor-pointer text-sm text-gray-600"
            />

            {/* Selected file */}
            {file && (
              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-left">

                <p className="text-sm font-medium text-blue-900">
                  Selected resume
                </p>

                <p className="mt-1 truncate text-sm text-blue-700">
                  {file.name}
                </p>

              </div>
            )}

          </div>

        </div>

        {/* Target Role */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">
            2. Target role

            <span className="ml-2 text-sm font-normal text-gray-400">
              Optional
            </span>
          </h2>

          <input
            type="text"
            placeholder="e.g. Backend Developer"
            value={targetRole}
            onChange={(event) =>
              setTargetRole(event.target.value)
            }
            className="mt-5 w-full rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

        {/* Job Description */}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">

          <h2 className="text-xl font-semibold text-gray-900">

            3. Job description

            <span className="ml-2 text-sm font-normal text-gray-400">
              Optional
            </span>

          </h2>

          <textarea
            rows={8}
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(event) =>
              setJobDescription(event.target.value)
            }
            className="mt-5 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            Providing a job description allows ResuForge.AI to
            evaluate relevant keywords and skills.
          </p>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Analyze Button */}
        <button
          type="button"
          disabled={isAnalyzing}
          className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleAnalyze}
        >
          Analyze Resume
        </button>

        <p className="mt-4 text-center text-sm text-gray-500">
          No account required.
        </p>

      </section>

    </main>
  );
}
