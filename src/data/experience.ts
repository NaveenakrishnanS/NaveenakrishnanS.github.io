import type { Role } from './types'

// Most recent first. Source: the user's LinkedIn profile (2026-10-02). Only stated facts; the
// start date is not given beyond the "3 yrs 9 mos" duration, so no month or year is shown.
export const experience: Role[] = [
  {
    id: 'clarium',
    company: 'Clarium Managed Services',
    role: 'Associate Software Engineer',
    period: 'Present, 3 yrs 9 mos',
    location: 'Chennai, full-time',
    contributions: [
      'Contributing to enterprise SaaS products with Java, Spring Boot, RESTful APIs, Python, FastAPI and microservices, including NLP integrations.',
      'Developed production-ready backend services with Spring Security, JWT-authenticated REST APIs and FastAPI.',
      'Working in Agile teams: Git workflows, CI/CD, code reviews and sprint planning.',
    ],
    stack: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'Microservices'],
  },
]
