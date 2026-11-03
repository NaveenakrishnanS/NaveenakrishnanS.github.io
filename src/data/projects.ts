import type { Project } from './types'

// Placeholder entries. Replace each field with real project facts; keep claims verifiable.
export const projects: Project[] = [
  {
    id: 'project-one',
    title: '[Project One]',
    summary: '[One line: what it is and who it is for.]',
    category: '[Product · Platform]',
    year: '[YYYY]',
    status: 'shipped',
    role: '[Your role — e.g. sole engineer, lead, contributor]',
    problem: '[The problem it solves, and why existing options fell short.]',
    built: '[What you personally built: services, interfaces, pipelines.]',
    decisions: [
      '[Key decision — what you chose and the trade-off behind it.]',
      '[Interesting technical problem and how you solved it.]',
    ],
    stack: ['[Tech]', '[Tech]', '[Tech]'],
    links: { live: undefined, github: undefined, caseStudy: undefined },
  },
  {
    id: 'project-two',
    title: '[Project Two]',
    summary: '[One line: what it is and who it is for.]',
    category: '[AI · Tooling]',
    year: '[YYYY]',
    status: 'in-progress',
    role: '[Your role]',
    problem: '[The problem it solves.]',
    built: '[What you built.]',
    decisions: ['[Key decision and trade-off.]', '[Architecture note.]'],
    stack: ['[Tech]', '[Tech]'],
  },
  {
    id: 'project-three',
    title: '[Project Three]',
    summary: '[One line: what it is and who it is for.]',
    category: '[Backend · Systems]',
    year: '[YYYY]',
    status: 'experimental',
    role: '[Your role]',
    problem: '[The problem it solves.]',
    built: '[What you built.]',
    decisions: ['[Key decision and trade-off.]'],
    stack: ['[Tech]', '[Tech]', '[Tech]'],
  },
]
