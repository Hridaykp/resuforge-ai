import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          ResuForge<span className="text-blue-600">.AI</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-gray-600">
          Analyze your resume with AI and discover how to improve your ATS
          score, skills, experience, and overall resume quality.
        </p>

        <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700">
          Analyze My Resume
        </button>
      </section>
    </main>
  );
}
