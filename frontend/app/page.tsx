export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-5">
          <div className="text-2xl font-bold tracking-tight text-gray-900">
            ResuForge<span className="text-blue-600">.AI</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-24 pt-24 text-center">
        <div className="mb-6 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
          AI-Powered Resume Analysis
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight text-gray-900 sm:text-6xl">
          Turn your resume into your
          <span className="text-blue-600"> next opportunity.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
          Upload your resume and get an AI-powered analysis of your ATS score,
          skills, experience, structure, and areas for improvement.
        </p>

        <a
          href="/analyze"
          className="mt-10 rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
        >
          Analyze My Resume
        </a>

        <p className="mt-4 text-sm text-gray-500">
          No account required
        </p>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Everything you need to improve your resume
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Get practical insights instead of generic resume advice.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon="📊"
              title="ATS Score"
              description="Get an explainable score based on resume completeness, structure, skills, experience, and ATS readability."
            />

            <FeatureCard
              icon="🤖"
              title="AI Analysis"
              description="Get personalized feedback powered by Gemini AI to understand what is working and what needs improvement."
            />

            <FeatureCard
              icon="🎯"
              title="Job Matching"
              description="Add a target role or job description to identify relevant keywords and skills missing from your resume."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How ResuForge.AI works
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step
              number="01"
              title="Upload"
              description="Upload your PDF or DOCX resume."
            />

            <Step
              number="02"
              title="Analyze"
              description="Our backend extracts your resume and analyzes it using ATS logic and Gemini AI."
            />

            <Step
              number="03"
              title="Improve"
              description="Review your score, missing keywords, strengths, weaknesses, and recommendations."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ready to improve your resume?
          </h2>

          <p className="mt-4 text-gray-600">
            Find out what your resume is doing well and where it can improve.
          </p>

          <a
            href="/analyze"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
          >
            Analyze My Resume
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} ResuForge.AI. Built with Next.js,
          FastAPI & Gemini AI.
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="text-3xl">{icon}</div>

      <h3 className="mt-5 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-600">
        {number}
      </div>

      <h3 className="mt-5 text-xl font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}