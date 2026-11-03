import type { BuildItem, Principle } from './types'

export const aboutStatement =
  // Draft condensed from the LinkedIn summary; rewrite in your own voice.
  'I build secure, high-performance backend systems on clean architecture principles, aimed at real-world problems. Most of my work is in Java and Spring Boot; I also ship cross-platform mobile apps with Flutter and Firebase.'

export const principles: Principle[] = [
  { id: 'p1', title: '[Principle]', body: '[What this means in practice, with a concrete example.]' },
  { id: 'p2', title: '[Principle]', body: '[What this means in practice.]' },
  { id: 'p3', title: '[Principle]', body: '[What this means in practice.]' },
]

// One item per honest status. Do not mark unfinished work as shipped.
export const building: BuildItem[] = [
  { id: 'b1', title: '[Current project]', kind: 'Project', status: 'in-progress', note: '[What it is and what you are figuring out.]' },
  { id: 'b2', title: '[Experiment]', kind: 'Experiment', status: 'experimental', note: '[The question this experiment tests.]' },
  { id: 'b3', title: '[Product concept]', kind: 'Concept', status: 'planned', note: '[The idea and why it is worth building.]' },
  { id: 'b4', title: 'Exploring AI technologies', kind: 'Research', status: 'in-progress', note: '[What you are studying and why.]' },
]
