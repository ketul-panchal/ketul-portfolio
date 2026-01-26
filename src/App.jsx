import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home';
import CustomCursor from './components/CustomCursor';
import SplashScreen from './components/SplashScreen';
import SmoothScroll from './components/SmoothScroll';
import './styles/index.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="App">
      <CustomCursor />

      <AnimatePresence mode="wait">
        {loading ? (
          <SplashScreen key="splash" onComplete={() => setLoading(false)} />
        ) : (
          <SmoothScroll key="content">
            <Home />
          </SmoothScroll>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;