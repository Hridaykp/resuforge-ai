interface SkillsMatchProps {
  matchedKeywords: string[];
  missingKeywords: string[];
}

export default function SkillsMatch({
  matchedKeywords,
  missingKeywords,
}: SkillsMatchProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Section heading */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Skills Match
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Skills found in your resume compared with the job
          description.
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {/* Matched skills */}
        <div>
          <h3 className="text-sm font-semibold text-green-700">
            Matched Skills
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {matchedKeywords.length > 0 ? (
              matchedKeywords.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-sm font-medium text-green-700"
                >
                  ✓ {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No matching skills found.
              </p>
            )}
          </div>
        </div>

        {/* Missing skills */}
        <div>
          <h3 className="text-sm font-semibold text-red-700">
            Missing Skills
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            {missingKeywords.length > 0 ? (
              missingKeywords.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700"
                >
                  + {skill}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-500">
                No missing skills found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
