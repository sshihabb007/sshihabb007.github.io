import { useEffect, useState } from 'react';
import { CyberCursor, NetworkBackground } from './components/BackgroundCanvas';
import { Certifications } from './components/Certifications';
import { Contact } from './components/Contact';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Footer, ScrollToTop } from './components/Footer';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { Projects } from './components/Projects';
import { Services } from './components/Services';
import { Skills } from './components/Skills';
import { ToolsSection } from './components/ToolsSection';
import { bindHashAnchorClicks } from './utils/scroll';

export default function App() {
  const [dark, setDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') return false;
      if (saved === 'dark') return true;
    } catch {
      /* ignore */
    }
    return true;
  });

  useEffect(() => {
    const html = document.documentElement;
    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch {
      /* ignore */
    }
  }, [dark]);

  useEffect(() => bindHashAnchorClicks(), []);

  return (
    <>
      <NetworkBackground />
      <CyberCursor />
      <Navbar dark={dark} onToggleTheme={() => setDark((d) => !d)} />
      <main id="main-content">
        <Hero />
        <Education />
        <Skills />
        <Services />
        <Experience />
        <Projects />
        <ToolsSection />
        <Certifications />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
