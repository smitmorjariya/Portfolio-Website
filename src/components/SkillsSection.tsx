import {
  Atom,
  Braces,
  Code2,
  Cpu,
  GitBranch,
  Github,
  Palette,
  Terminal,
  Wind,
  type LucideIcon,
} from 'lucide-react';
import { SKILL_GROUPS } from '../data/portfolioData';

const SKILL_ICON_MAP: Record<string, LucideIcon> = {
  HTML5: Code2,
  CSS3: Palette,
  JavaScript: Braces,
  'Tailwind CSS': Wind,
  'React.js': Atom,
  Git: GitBranch,
  GitHub: Github,
  'VS Code': Terminal,
  'Google AI Studio': Cpu,
};

export function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      data-reveal-section
      className="scroll-mt-16 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <p className="font-mono text-xs text-[#A78BFA] tabular-nums">02. Technical Skills</p>
          <h2
            id="skills-heading"
            className="mt-3 font-display text-2xl font-semibold tracking-tight text-[#F4F5F8] sm:text-3xl lg:text-4xl"
          >
            Core technologies I work with every day.
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#A1A8BA] sm:text-base">
            Focused on practical front-end web development fundamentals and reliable version-control workflows—listed accurately without inflated claims.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {SKILL_GROUPS.map((group) => (
            <div
              key={group.category}
              data-reveal-item
              data-skill-group={group.category.toLowerCase()}
              className={group.category === 'Frontend' ? 'lg:col-span-7' : 'lg:col-span-5'}
            >
              <div className="card-interactive h-full rounded-2xl border border-white/[0.08] bg-[#0D0F16] p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4 border-b border-white/[0.08] pb-4">
                  <h3 className="font-display text-xl font-semibold text-[#F4F5F8]">
                    {group.category}
                  </h3>
                  <span className="font-mono text-xs text-[#6E768B] tabular-nums">
                    {group.items.length} technologies
                  </span>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-[#A1A8BA]">
                  {group.description}
                </p>

                <ul className="mt-6 divide-y divide-white/[0.06]">
                  {group.items.map((skill, idx) => {
                    const Icon = SKILL_ICON_MAP[skill.name] ?? Code2;
                    return (
                      <li
                        key={skill.name}
                        data-skill-badge
                        className="group skill-row-interactive -mx-2.5 flex flex-col gap-2 rounded-xl px-2.5 py-3.5 first:mt-0 sm:flex-row sm:items-center sm:justify-between sm:gap-5"
                      >
                        <div className="flex items-center gap-3 shrink-0">
                          <span
                            aria-hidden="true"
                            className="skill-icon-badge inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.03] text-[#93A0BA]"
                          >
                            <Icon className="h-4 w-4" />
                          </span>
                          <div className="flex items-baseline gap-2.5">
                            <span className="font-mono text-xs text-[#6E768B] tabular-nums transition-colors duration-300 group-hover:text-[#93C5FD]">
                              {`0${idx + 1}`}
                            </span>
                            <span className="font-display text-base font-semibold text-[#F4F5F8] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:text-[#C4B5FD]">
                              {skill.name}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs leading-relaxed text-[#A1A8BA] transition-colors duration-300 group-hover:text-[#D6DBE7] sm:text-right sm:text-[13px]">
                          {skill.context}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
