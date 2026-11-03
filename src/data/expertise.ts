import type { ExpertiseArea } from './types'

// Keep only areas backed by real experience. Evidence format: solved X using Y (evidence), because Z (because).
// Each `evidence` line restates the LinkedIn profile; `because` is the user's to supply.
export const expertise: ExpertiseArea[] = [
  {
    id: 'backend',
    area: 'Backend & APIs',
    evidence: 'Built JWT-authenticated REST APIs for enterprise SaaS products using Spring Boot and Spring Security',
    because: '[reason]',
    tools: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'Hibernate', 'MySQL', 'Maven'],
  },
  {
    id: 'python',
    area: 'Python services',
    evidence: 'Built backend services in Python using FastAPI',
    because: '[reason]',
    tools: ['Python', 'FastAPI', 'REST APIs'],
  },
  {
    id: 'mobile',
    area: 'Cross-platform mobile',
    evidence: 'Built and deployed cross-platform apps with real-time sync and user authentication using Flutter and Firebase',
    because: '[reason]',
    tools: ['Flutter', 'Dart', 'Firebase', 'Cloud Firestore', 'Bloc'],
  },
  {
    id: 'ai',
    area: 'AI engineering',
    evidence: 'Integrated NLP capabilities into enterprise backend services',
    because: '[reason]',
    tools: ['[Library / model]'],
  },
]
