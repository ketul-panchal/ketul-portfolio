import GlassNavbar from '../components/layout/GlassNavbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Gallery from '../components/sections/Gallery';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

const Home = () => {
  return (
    <div className="home">
      <GlassNavbar />
      <Hero />
      <About />
      <Gallery />
      <Skills />
      <Projects />
      <Contact />
    </div>
  );
};

export default Home;
