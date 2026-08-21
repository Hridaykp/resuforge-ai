"use client";

import { useState } from "react";
import { analyzeResume } from "@/lib/api";

export default function AnalyzePage() {
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [error, setError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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
        setError("");

        try {
            const result = await analyzeResume(
            file,
            targetRole,
            jobDescription,
            );

            console.log("Analysis result:", result);
        } catch (error) {
            console.error(error);

            setError(
            error instanceof Error
                ? error.message
                : "Something went wrong while analyzing your resume.",
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

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
            Upload your resume and optionally provide a target role or job
            description for a more relevant analysis.
          </p>
        </div>

        {/* Upload Card */}
        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">
            1. Upload your resume
          </h2>

          <div className="mt-5 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
            <div className="text-4xl">📄</div>

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
                    const selectedFile = event.target.files?.[0] ?? null;
                    setFile(selectedFile);
                }}
                className="mt-6 block w-full cursor-pointer text-sm text-gray-600"
            />
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
            onChange={(event) => setTargetRole(event.target.value)}
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
            onChange={(event) => setJobDescription(event.target.value)}
            className="mt-5 w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <p className="mt-2 text-sm text-gray-500">
            Providing a job description allows ResuForge.AI to evaluate
            relevant keywords and skills.
          </p>
        </div>

        {/* For displaying error */}
        {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
        </div>
        )}
        {/* Analyze Button */}
        <button
          type="button"
          className="mt-8 w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
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