import type { BuildItem, Principle } from './types'

// Drafted from the user's LinkedIn summary (2026-10-02), close to their own words. Rewrite freely.
export const aboutStatement =
  'I build secure, high-performance systems using clean architecture principles, with a focus on real-world problems. Most of my work is backend: Java and Spring Boot services, Python with FastAPI, and the APIs that connect them to web and mobile apps.'

export const principles: Principle[] = [
  {
    id: 'p1',
    title: 'Clean architecture',
    body: 'Structure services so they stay readable, testable and easy to change as the product grows.',
  },
  {
    id: 'p2',
    title: 'Security from the start',
    body: 'Authentication and authorization are designed in, not bolted on. Spring Security, JWT, and a certification in ethical hacking.',
  },
  {
    id: 'p3',
    title: 'Real-world problems',
    body: 'Build for the problem people actually have, and take it all the way to production.',
  },
]

// One item per honest status. Do not mark unfinished work as shipped.
export const building: BuildItem[] = [
  { id: 'b1', title: '[Current project]', kind: 'Project', status: 'in-progress', note: '[What it is and what you are figuring out.]' },
  { id: 'b2', title: '[Experiment]', kind: 'Experiment', status: 'experimental', note: '[The question this experiment tests.]' },
  { id: 'b3', title: '[Product concept]', kind: 'Concept', status: 'planned', note: '[The idea and why it is worth building.]' },
  {
    id: 'b4',
    title: 'Exploring AI technologies',
    kind: 'Research',
    status: 'in-progress',
    note: 'Where AI fits in real products, building on NLP integration work in enterprise SaaS.',
  },
]
