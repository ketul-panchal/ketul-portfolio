import Navbar from '../components/Navbar';
import GlassNavbar from '../components/GlassNavbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';

const Home = () => {
  return (
    <div className="home">
      {/* <Navbar /> */}
      <GlassNavbar />
      <Hero />
      <About />
      <Skills />
      <Projects />

      <section id="contact" style={{
        minHeight: '100vh',
        padding: '100px 10%',
        background: '#0a0a0a',
        color: '#fff'
      }}>
        <h2 style={{ fontSize: '3rem' }}>Contact Section</h2>
      </section>
    </div>
  );
};

export default Home;