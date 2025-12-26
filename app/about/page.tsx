"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AboutPage = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? resolvedTheme === "dark" : false;

  const experiences = [
    {
      id: 1,
      title: "Web developer",
      company: "Samdech Preah Masangharajah Bour Kry University",
      period: "2024 - 2025",
      description:
        "Developed and maintained the university's official website, ensuring optimal performance and user experience. Collaborated with cross-functional teams to implement new features and improve existing functionalities.",
      technologies: ["Laravel", "MySQL","Filament","Bootstrap"],
    },
  ];
  const education = [
    {
      id: 1,
      title: "Bachelor of Science in Computer Science",
      school: "Samdech Preah Masangharajah Bour Kry University",
      period: "2022 - 2026",
      description:
        "Comprehensive program covering algorithms, data structures, software development, full stack development, and database management.",
      technologies: ["HTML", "CSS", "JavaScript", "C#", "C++", "SQL", "PHP"],
    },
    {
      id: 2,
      title: "Ultimate Nextjs React and ReduxFull Stack Web Development ",
      school: "Udemy",
      period: "2025",
      description:
        "In-depth course on building full stack applications using Next.js, React, and Redux.",
      technologies: [
        "Next.js",
        "React",
        "Redux",
        "Node.js",
        "MongoDB",
        "TypeScript",
        "TailwindCSS",
        "Prisma",
        " PostgreSQL",
      ],
    },
    {
      id: 3,
      title: "IBM Full Stack Developer Certificate",
      school: "IBM",
      period: "Process",
      description:
        "Certified full stack developer with a focus on modern web technologies and best practices.",
      technologies: [
        "HTML",
        "CSS",
        "JavaScript",
        "React",
        "Node.js",
        "Express",
        "MongoDB",
      ],
    },
  ];

  return (
    <section className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1
          className={cn(
            "text-3xl font-bold mb-3",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Education
        </h1>
        <p
          className={cn(
            "text-base",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          Academic background and qualifications
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className={cn(
            "absolute left-3 top-6 bottom-0 w-px",
            isDark ? "bg-gray-700" : "bg-gray-200"
          )}
        ></div>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <div key={edu.id} className="relative flex gap-6">
              {/* Timeline dot */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1",
                  index === 0
                    ? isDark
                      ? "bg-blue-500 border-blue-500"
                      : "bg-blue-500 border-blue-500"
                    : isDark
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-300"
                )}
              ></div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={cn(
                      "text-lg font-semibold",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                  >
                    {edu.title}
                  </h3>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {edu.period}
                  </span>
                </div>

                <p
                  className={cn(
                    "text-sm font-medium mb-3",
                    isDark ? "text-blue-400" : "text-blue-600"
                  )}
                >
                  {edu.school}
                </p>

                <p
                  className={cn(
                    "text-sm mb-4 leading-relaxed",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  {edu.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {edu.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded",
                        isDark
                          ? "bg-gray-800 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mb-12">
        <h1
          className={cn(
            "text-3xl font-bold mb-3",
            isDark ? "text-white" : "text-gray-900"
          )}
        >
          Experience
        </h1>
        <p
          className={cn(
            "text-base",
            isDark ? "text-gray-400" : "text-gray-600"
          )}
        >
          Professional journey and key milestones
        </p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className={cn(
            "absolute left-3 top-6 bottom-0 w-px",
            isDark ? "bg-gray-700" : "bg-gray-200"
          )}
        ></div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative flex gap-6">
              {/* Timeline dot */}
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex-shrink-0 mt-1",
                  index === 0
                    ? isDark
                      ? "bg-blue-500 border-blue-500"
                      : "bg-blue-500 border-blue-500"
                    : isDark
                    ? "bg-gray-800 border-gray-600"
                    : "bg-white border-gray-300"
                )}
              ></div>

              {/* Content */}
              <div className="min-w-0 flex-1 pb-8">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className={cn(
                      "text-lg font-semibold",
                      isDark ? "text-white" : "text-gray-900"
                    )}
                  >
                    {exp.title}
                  </h3>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isDark ? "text-gray-400" : "text-gray-500"
                    )}
                  >
                    {exp.period}
                  </span>
                </div>

                <p
                  className={cn(
                    "text-sm font-medium mb-3",
                    isDark ? "text-blue-400" : "text-blue-600"
                  )}
                >
                  {exp.company}
                </p>

                <p
                  className={cn(
                    "text-sm mb-4 leading-relaxed",
                    isDark ? "text-gray-300" : "text-gray-600"
                  )}
                >
                  {exp.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded",
                        isDark
                          ? "bg-gray-800 text-gray-300"
                          : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
