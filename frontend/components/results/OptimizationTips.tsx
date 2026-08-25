interface OptimizationTipsProps {
  tips: string[];
  missingInformation: string[];
}

export default function OptimizationTips({
  tips,
  missingInformation,
}: OptimizationTipsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ATS optimization tips */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          ATS Optimization Tips
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Suggestions to improve your resume's ATS
          compatibility.
        </p>

        <div className="mt-6">
          {tips.length > 0 ? (
            <ol className="space-y-4">
              {tips.map((tip, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm leading-6 text-gray-700"
                >
                  {/* Number each tip so the user knows
                      which improvement to tackle first. */}
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700">
                    {index + 1}
                  </span>

                  <span>
                    {/* 
                      The backend may already return a number
                      such as "1. Fix header formatting".
                      Remove it to avoid "1. 1. Fix...".
                    */}
                    {tip.replace(/^\d+\.\s*/, "")}
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-gray-500">
              No optimization tips available.
            </p>
          )}
        </div>
      </div>

      {/* Missing information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Missing Information
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Information that could make your resume more
          complete for this role.
        </p>

        <div className="mt-6">
          {missingInformation.length > 0 ? (
            <ul className="space-y-4">
              {missingInformation.map((item, index) => (
                <li
                  key={index}
                  className="flex gap-3 text-sm leading-6 text-gray-700"
                >
                  {/* Highlight missing information with a warning
                      indicator. */}
                  <span className="mt-0.5 text-orange-500">
                    !
                  </span>

                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No missing information identified.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
