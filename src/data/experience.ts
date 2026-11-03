import type { Role } from './types'

// Most recent first. Placeholders only — never fill with invented employers or dates.
export const experience: Role[] = [
  {
    id: 'role-clarium',
    company: 'Clarium Managed Services',
    role: 'Associate Software Engineer',
    start: '[Mon YYYY]',
    end: 'Present',
    location: 'Chennai, India',
    contributions: [
      'Build backend services for enterprise SaaS products in Java and Spring Boot, and in Python with FastAPI, within a microservices architecture.',
      'Develop REST APIs secured with Spring Security and JWT authentication.',
      'Integrate NLP capabilities into backend services.',
      'Work in Agile sprints: Git workflows, CI/CD, code reviews and sprint planning.',
    ],
    stack: ['Java', 'Spring Boot', 'Python', 'FastAPI', 'REST APIs', 'Microservices'],
  },
]
