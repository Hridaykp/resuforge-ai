interface AtsBreakdownProps {
  breakdown: {
    completeness: number;
    section_structure: number;
    skills_keywords: number;
    experience_achievements: number;
    readability_parsing: number;
  };
}

// Convert the backend field name into a readable label.
const breakdownLabels = {
  completeness: "Completeness",
  section_structure: "Section Structure",
  skills_keywords: "Skills & Keywords",
  experience_achievements: "Experience & Achievements",
  readability_parsing: "Readability & Parsing",
};

export default function AtsBreakdown({breakdown, }: AtsBreakdownProps) {
  // Convert the breakdown object into an array so we can easily render each category using .map().
  const items = Object.entries(breakdown) as [
    keyof typeof breakdownLabels,
    number,
  ][];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          ATS Breakdown
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Here's how your resume performed across different
          ATS categories.
        </p>
      </div>

      {/* Breakdown categories */}
      <div className="mt-6 space-y-5">
        {items.map(([key, score]) => {
          // Convert the score into a percentage.
          // Our current ATS categories use a maximum score of 20.
          const percentage = (score / 20) * 100;

          return (
            <div key={key}>
              {/* Category name and score */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {breakdownLabels[key]}
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {score}/20
                </span>
              </div>

              {/* Progress bar background */}
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                {/* Progress bar based on the score */}
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
