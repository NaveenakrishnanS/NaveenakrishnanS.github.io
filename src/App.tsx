import { SiteChrome } from './components/navigation/SiteChrome'
import { useSpotlightDelegation } from './hooks/usePointerMotion'
import { AboutSection } from './sections/AboutSection'
import { BuildingSection } from './sections/BuildingSection'
import { ContactSection } from './sections/ContactSection'
import { ExperienceSection } from './sections/ExperienceSection'
import { ExpertiseSection } from './sections/ExpertiseSection'
import { HeroSection } from './sections/HeroSection'
import { ProjectsSection } from './sections/ProjectsSection'

export default function App() {
  // One delegated pointer listener lights every `.spotlight` card (fine pointers only).
  useSpotlightDelegation()

  return (
    <>
      <SiteChrome />
      <div aria-hidden="true" className="grain" />
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
