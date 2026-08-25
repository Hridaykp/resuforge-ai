export interface ResumeAnalysisResponse {
  filename: string;

  resume_analysis: {
    target_role: string;
    job_description: string;

    candidate: {
      name: string | null;
      email: string | null;
      phone: string | null;
      location: string | null;
    };

    experience: {
      total_years: number;
      professional_years: number;
      internship_years: number;
      entries: ExperienceEntry[];
    };

    skills: string[];

    education: Education[];

    projects: Project[];

    certifications: string[];

    links: {
      github: string | null;
      linkedin: string | null;
      portfolio: string | null;
      other: string[];
    };
  };

  ats_analysis: {
    ats_score: number;
    max_score: number;

    breakdown: {
      completeness: number;
      section_structure: number;
      skills_keywords: number;
      experience_achievements: number;
      readability_parsing: number;
    };

    matched_keywords: string[];
    missing_keywords: string[];

    preferred_keywords: {
      matched: string[];
      missing: string[];
    };

    jd_analysis: {
      target_role: string;

      requirements: {
        experience: string | null;

        skills: {
          required: string[];
          preferred: string[];
        };

        education: {
          required: string[];
          preferred: string[];
        };

        certifications: string[];
      };

      responsibilities: string[];

      keywords: string[];

      skill_count: {
        required: number;
        preferred: number;
        total: number;
      };
    };

    target_role: string;
  };

  ai_analysis: {
    overall_assessment: string;

    strengths: string[];

    weaknesses: string[];

    suggestions: string[];

    ats_optimization_tips: string[];

    missing_information: string[];
  };
}

export interface ExperienceEntry {
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

export interface Education {
  degree: string;
  field: string | null;
  institution: string;
  start_date: string | null;
  end_date: string | null;
  grade: string | null;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
  responsibilities: string[];
  achievements: string[];
  url: string | null;
}
