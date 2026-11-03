import type { ExpertiseArea } from './types'

// Source: the user's LinkedIn profile (2026-10-02). Statements describe stated work only; the
// "because Z" reasoning is not in the profile, so add it in your own words when you can.
export const expertise: ExpertiseArea[] = [
  {
    id: 'backend',
    area: 'Backend & APIs',
    evidence:
      'Production backend services in Java and Spring Boot, secured with Spring Security and JWT-authenticated REST APIs, inside microservice-based enterprise SaaS.',
    tools: ['Java', 'Spring Boot', 'Spring Security', 'JWT', 'Hibernate', 'MySQL', 'Maven'],
  },
  {
    id: 'python-ai',
    area: 'Python & AI integration',
    evidence: 'FastAPI services in Python, including NLP integrations in enterprise products, while exploring wider AI technologies.',
    tools: ['Python', 'FastAPI', 'NLP'],
  },
  {
    id: 'mobile',
    area: 'Cross-platform mobile',
    evidence: 'Cross-platform apps built and deployed with Flutter and Firebase, with real-time sync and user authentication.',
    tools: ['Flutter', 'Dart', 'Firebase', 'Cloud Firestore', 'Bloc'],
  },
  {
    id: 'delivery',
    area: 'Frontend & delivery',
    evidence: 'Angular frontends, shipped through Agile delivery: Git workflows, CI/CD, code reviews and sprint planning.',
    tools: ['Angular', 'JavaScript', 'HTML', 'CSS', 'Git', 'GitHub', 'Postman'],
  },
]
