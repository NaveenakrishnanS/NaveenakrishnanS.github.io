import { Navbar } from './components/navigation/Navbar'
import { AboutSection } from './sections/AboutSection'
import { BuildingSection } from './sections/BuildingSection'
import { ContactSection } from './sections/ContactSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { ExpertiseSection } from './sections/ExpertiseSection'
import { HeroSection } from './sections/HeroSection'
import { ProjectsSection } from './sections/ProjectsSection'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ProjectsSection />
        <ExpertiseSection />
        <ExperienceSection />
        <AboutSection />
        <BuildingSection />
        <ContactSection />
      </main>
    </>
  )
}
