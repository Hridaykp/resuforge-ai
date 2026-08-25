interface AtsScoreProps {
  score: number;
  maxScore: number;
}

export default function AtsScore({
  score,
  maxScore,
}: AtsScoreProps) {
  // Convert the raw score into a percentage so we can
  // determine the appropriate score category.
  const percentage = (score / maxScore) * 100;

  // Returns the text color based on the ATS score.
  const getScoreColor = () => {
    if (percentage >= 80) {
      return "text-green-600";
    }

    if (percentage >= 60) {
      return "text-yellow-600";
    }

    return "text-red-600";
  };

  // Returns a human-readable label for the score.
  const getScoreLabel = () => {
    if (percentage >= 80) {
      return "Strong Match";
    }

    if (percentage >= 60) {
      return "Needs Improvement";
    }

    return "Low Match";
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
          ATS Score
        </p>

        {/* Display the score with its maximum value */}
        <div
          className={`mt-3 text-6xl font-bold ${getScoreColor()}`}
        >
          {score}
          <span className="text-2xl text-gray-400">
            /{maxScore}
          </span>
        </div>

        {/* Show a meaningful label such as "Strong Match" */}
        <p
          className={`mt-2 text-lg font-semibold ${getScoreColor()}`}
        >
          {getScoreLabel()}
        </p>

        <p className="mt-3 max-w-md text-sm text-gray-500">
          This score represents how well your resume matches
          the target job description.
        </p>
      </div>
    </div>
  );
}
