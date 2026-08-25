interface ResumeOverviewProps {
  candidate: {
    name: string | null;
    email: string | null;
    phone: string | null;
    location: string | null;
  };

  targetRole: string;

  experience: {
    total_years: number;
    professional_years: number;
    internship_years: number;
  };

  skills: string[];
}

export default function ResumeOverview({
  candidate,
  targetRole,
  experience,
  skills,
}: ResumeOverviewProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      {/* Basic candidate information */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          Resume Overview
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Key information extracted from your resume.
        </p>
      </div>

      {/* Candidate details */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <p className="text-sm text-gray-500">
            Candidate
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {candidate.name || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Target Role
          </p>

          <p className="mt-1 font-medium capitalize text-gray-900">
            {targetRole || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Location
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {candidate.location || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">
            Experience
          </p>

          <p className="mt-1 font-medium text-gray-900">
            {experience.total_years} years
          </p>
        </div>
      </div>

      {/* Technical skills extracted from the resume */}
      <div className="mt-8">
        <h3 className="text-sm font-semibold text-gray-900">
          Skills Found
        </h3>

        <div className="mt-3 flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No skills found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
