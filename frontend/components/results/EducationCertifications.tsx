interface Education {
  degree: string;
  field: string | null;
  institution: string;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
}

interface EducationCertificationsProps {
  education: Education[];
  certifications: string[];
}

export default function EducationCertifications({
  education,
  certifications,
}: EducationCertificationsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Education section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Education
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Educational qualifications extracted from your
          resume.
        </p>

        <div className="mt-6 space-y-5">
          {education.length > 0 ? (
            education.map((item, index) => (
              <div
                key={`${item.institution}-${index}`}
                className="border-l-2 border-blue-200 pl-4"
              >
                {/* Degree and field of study */}
                <h3 className="font-semibold text-gray-900">
                  {item.degree}
                  {item.field && ` — ${item.field}`}
                </h3>

                {/* Institution name */}
                <p className="mt-1 text-sm font-medium text-blue-600">
                  {item.institution}
                </p>

                {/* Education duration */}
                {(item.start_date || item.end_date) && (
                  <p className="mt-1 text-sm text-gray-500">
                    {item.start_date || "Unknown"} -{" "}
                    {item.end_date || "Present"}
                  </p>
                )}

                {/* Grade is optional because many resumes
                    don't contain a GPA or percentage. */}
                {item.grade && (
                  <p className="mt-1 text-sm text-gray-600">
                    Grade: {item.grade}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No education information found.
            </p>
          )}
        </div>
      </div>

      {/* Certifications section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900">
          Certifications
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Certifications extracted from your resume.
        </p>

        <div className="mt-6">
          {certifications.length > 0 ? (
            <ul className="space-y-3">
              {certifications.map((certification, index) => (
                <li
                  key={`${certification}-${index}`}
                  className="flex gap-3 text-sm text-gray-700"
                >
                  {/* Check mark makes certifications
                      easy to scan. */}
                  <span className="text-green-600">
                    ✓
                  </span>

                  <span>{certification}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">
              No certifications found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
