import { lazy, Suspense, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary';
import CustomCursor from './components/ui/CustomCursor';
import SplashScreen from './components/layout/SplashScreen';
import SmoothScroll from './components/layout/SmoothScroll';
import './styles/index.css';

// Lazy-load the main page so the splash screen renders immediately
// and the heavy section JS is only parsed after the loader exits.
const Home = lazy(() => import('./pages/Home'));

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <ErrorBoundary>
      <div className="App">
        <CustomCursor />

        <AnimatePresence mode="wait">
          {loading ? (
            <SplashScreen key="splash" onComplete={() => setLoading(false)} />
          ) : (
            <SmoothScroll key="content">
              <Suspense fallback={null}>
                <Home />
              </Suspense>
            </SmoothScroll>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;
