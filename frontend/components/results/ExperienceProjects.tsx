interface ExperienceEntry {
  company: string;
  title: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  duration_months: number | null;
  employment_type: string | null;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
  url: string | null;
}

interface ExperienceProjectsProps {
  experience: {
    total_years: number;
    professional_years: number;
    internship_years: number;
    entries: ExperienceEntry[];
  };

  projects: Project[];
}

export default function ExperienceProjects({
  experience,
  projects,
}: ExperienceProjectsProps) {
  return (
    <div className="space-y-6">
      {/* Experience section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Experience
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Professional and internship experience extracted
            from your resume.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {experience.entries.length > 0 ? (
            experience.entries.map((entry, index) => (
              <div
                key={`${entry.company}-${index}`}
                className="border-l-2 border-blue-200 pl-5"
              >
                {/* Job title and company */}
                <h3 className="font-semibold text-gray-900">
                  {entry.title || "Experience"}
                </h3>

                <p className="mt-1 text-sm font-medium text-blue-600">
                  {entry.company}
                </p>

                {/* Employment metadata */}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  {entry.location && (
                    <span>{entry.location}</span>
                  )}

                  {entry.start_date && (
                    <span>
                      {entry.start_date} -{" "}
                      {entry.end_date || "Present"}
                    </span>
                  )}

                  {entry.employment_type && (
                    <span className="capitalize">
                      {entry.employment_type}
                    </span>
                  )}
                </div>

                {/* Technologies used during the experience */}
                {entry.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {entry.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}

                {/* Responsibilities */}
                {entry.responsibilities.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {entry.responsibilities.map(
                      (responsibility, responsibilityIndex) => (
                        <li
                          key={responsibilityIndex}
                          className="flex gap-3 text-sm leading-6 text-gray-700"
                        >
                          <span className="text-gray-400">
                            •
                          </span>

                          <span>{responsibility}</span>
                        </li>
                      ),
                    )}
                  </ul>
                )}

                {/* Achievements */}
                {entry.achievements.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Achievements
                    </p>

                    <ul className="mt-2 space-y-2">
                      {entry.achievements.map(
                        (achievement, achievementIndex) => (
                          <li
                            key={achievementIndex}
                            className="flex gap-3 text-sm leading-6 text-gray-700"
                          >
                            <span className="text-green-600">
                              ✓
                            </span>

                            <span>{achievement}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No experience found in the resume.
            </p>
          )}
        </div>
      </div>

      {/* Projects section */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Projects
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Projects extracted from your resume.
          </p>
        </div>

        <div className="mt-6 space-y-6">
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                className="rounded-xl border border-gray-100 bg-gray-50 p-5"
              >
                {/* Project name */}
                <h3 className="font-semibold text-gray-900">
                  {project.name}
                </h3>

                {/* Project description */}
                {project.description && (
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    {project.description}
                  </p>
                )}

                {/* Technologies used in the project */}
                {project.technologies.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((technology) => (
                      <span
                        key={technology}
                        className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700"
                      >
                        {technology}
                      </span>
                    ))}
                  </div>
                )}

                {/* Project responsibilities */}
                {project.responsibilities.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {project.responsibilities.map(
                      (responsibility, responsibilityIndex) => (
                        <li
                          key={responsibilityIndex}
                          className="flex gap-3 text-sm leading-6 text-gray-700"
                        >
                          <span className="text-gray-400">
                            •
                          </span>

                          <span>{responsibility}</span>
                        </li>
                      ),
                    )}
                  </ul>
                )}

                {/* Project achievements */}
                {project.achievements.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-900">
                      Achievements
                    </p>

                    <ul className="mt-2 space-y-2">
                      {project.achievements.map(
                        (achievement, achievementIndex) => (
                          <li
                            key={achievementIndex}
                            className="flex gap-3 text-sm leading-6 text-gray-700"
                          >
                            <span className="text-green-600">
                              ✓
                            </span>

                            <span>{achievement}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                {/* Show project link only when one exists */}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    View Project →
                  </a>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">
              No projects found in the resume.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
