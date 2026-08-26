import type { PriorityImprovement } from "@/types/resume";

interface PriorityImprovementsProps {
  improvements: PriorityImprovement[];
}

export default function PriorityImprovements({
  improvements,
}: PriorityImprovementsProps) {
  // ----------------------------------------------------------
  // Empty state
  // ----------------------------------------------------------

  if (!improvements || improvements.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Priority Improvements
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          No priority improvements were identified.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* ------------------------------------------------------
          Header
      ------------------------------------------------------- */}

      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Priority Improvements
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Focus on these changes first to improve your resume.
        </p>
      </div>

      {/* ------------------------------------------------------
          Improvement list
      ------------------------------------------------------- */}

      <div className="mt-6 space-y-4">
        {improvements.map((improvement) => (
          <div
            key={improvement.id}
            className="rounded-xl border border-gray-200 p-4"
          >
            <div className="flex items-start gap-4">
              {/* Priority number */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                {String(improvement.priority).padStart(2, "0")}
              </div>

              {/* Improvement content */}

              <div className="min-w-0 flex-1">
                {/* Title + severity */}

                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-gray-900">
                    {improvement.title}
                  </h3>

                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      improvement.severity === "high"
                        ? "bg-red-100 text-red-700"
                        : improvement.severity === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {improvement.severity}
                  </span>
                </div>

                {/* Description */}

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {improvement.description}
                </p>

                {/* Related keywords */}

                {improvement.related_keywords.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {improvement.related_keywords.map(
                      (keyword) => (
                        <span
                          key={keyword}
                          className="rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700"
                        >
                          {keyword}
                        </span>
                      ),
                    )}
                  </div>
                )}

                {/* Related resume sections */}

                {improvement.related_sections.length > 0 && (
                  <div className="mt-3 text-xs text-gray-500">
                    <span className="font-medium">
                      Sections:
                    </span>{" "}
                    {improvement.related_sections.join(" · ")}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
