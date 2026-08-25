interface ResultsHeaderProps {
  filename: string;
  targetRole: string;
}

export default function ResultsHeader({
  filename,
  targetRole,
}: ResultsHeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Brand and back navigation */}
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900"
          >
            ResuForge
            <span className="text-blue-600">.AI</span>
          </a>

          {/* 
            Takes the user back to the upload page
            so they can analyze another resume.
          */}
          <a
            href="/analyze"
            className="text-sm font-medium text-gray-600 transition hover:text-blue-600"
          >
            Analyze another resume →
          </a>
        </div>

        {/* Page title */}
        <div className="mt-8">
          <p className="text-sm font-medium text-blue-600">
            Resume Analysis
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {filename}
          </h1>

          {/* 
            Only show the target role when the user
            provided one during analysis.
          */}
          {targetRole && (
            <p className="mt-2 text-gray-600">
              Analysis for{" "}
              <span className="font-medium text-gray-900">
                {targetRole}
              </span>
            </p>
          )}
        </div>
      </div>
    </header>
  );
}
