interface AiAssessmentProps {
  overallAssessment: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export default function AiAssessment({
  overallAssessment,
  strengths,
  weaknesses,
  suggestions,
}: AiAssessmentProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Main section heading */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          AI Assessment
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          AI-generated feedback based on your resume and
          target job description.
        </p>
      </div>

      {/* Overall assessment */}
      <div className="mt-6 rounded-xl bg-blue-50 p-5">
        <h3 className="font-semibold text-blue-900">
          Overall Assessment
        </h3>

        <p className="mt-2 text-sm leading-6 text-blue-800">
          {overallAssessment}
        </p>
      </div>

      {/* Strengths */}
      <div className="mt-8">
        <h3 className="font-semibold text-green-700">
          Strengths
        </h3>

        <ul className="mt-3 space-y-3">
          {strengths.map((strength, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm leading-6 text-gray-700"
            >
              {/* Check mark makes positive points easy to scan */}
              <span className="mt-0.5 text-green-600">
                ✓
              </span>

              <span>{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="mt-8">
        <h3 className="font-semibold text-red-700">
          Weaknesses
        </h3>

        <ul className="mt-3 space-y-3">
          {weaknesses.map((weakness, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm leading-6 text-gray-700"
            >
              {/* Warning symbol highlights areas that need improvement */}
              <span className="mt-0.5 text-red-600">
                !
              </span>

              <span>{weakness}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="mt-8">
        <h3 className="font-semibold text-blue-700">
          Suggestions
        </h3>

        <ol className="mt-3 space-y-3">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="flex gap-3 text-sm leading-6 text-gray-700"
            >
              {/* Number each recommendation so users can follow them */}
              <span className="font-semibold text-blue-600">
                {index + 1}.
              </span>

              <span>
                {/* 
                  Your backend currently returns suggestions
                  like "1. Detail the internship...".
                  Remove that existing number so we don't
                  display "1. 1. Detail...".
                */}
                {suggestion.replace(/^\d+\.\s*/, "")}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
