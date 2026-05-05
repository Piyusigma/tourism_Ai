import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import LandingScreen from './components/LandingScreen';
import CaptureScreen from './components/CaptureScreen';
import ExperienceScreen from './components/ExperienceScreen';
import BackgroundEffects from './components/BackgroundEffects';
import { useGemini } from './hooks/useGemini';
import { createPreviewUrl } from './utils/imageUtils';
import { AlertTriangle, KeyRound, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

// Screens: 'landing' | 'capture' | 'experience'
export default function App() {
  const [screen, setScreen] = useState('landing');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const { loading, error, result, analyzeImage, reset, isKeyMissing } = useGemini();

  // FIX: Move screen transition to useEffect to avoid render-time state updates
  useEffect(() => {
    if (result && screen === 'capture') {
      setScreen('experience');
    }
  }, [result, screen]);

  // Navigate to capture screen with optional pre-selected file
  const goToCapture = useCallback((file = null) => {
    if (file) {
      setSelectedFile(file);
      setImageUrl(createPreviewUrl(file));
    }
    setScreen('capture');
  }, []);

  // Navigate to camera (same as capture, but camera will open)
  const goToCamera = useCallback(() => {
    setSelectedFile(null);
    setImageUrl(null);
    setScreen('capture');
  }, []);

  // Discover — send image to Gemini
  const handleDiscover = useCallback(async (file) => {
    if (!file) return;
    setSelectedFile(file);
    setImageUrl(createPreviewUrl(file));
    await analyzeImage(file);
  }, [analyzeImage]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    reset();
    setSelectedFile(null);
    setImageUrl(null);
    setScreen('landing');
  }, [reset]);

  const handleBackToCapture = useCallback(() => {
    reset();
    setScreen('capture');
  }, [reset]);

  // API Key missing overlay
  if (isKeyMissing && screen !== 'landing') {
    return (
      <div className="page-wrapper items-center justify-center p-6" style={{ background: '#000' }}>
        <motion.div
          className="glass-card p-8 max-w-lg w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-14 h-14 rounded-full border border-[var(--border-medium)] flex items-center justify-center mx-auto mb-6"
               style={{ background: 'rgba(255,255,255,0.04)' }}>
            <KeyRound className="w-6 h-6 text-[var(--text-secondary)]" />
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-3" style={{ letterSpacing: '-0.02em' }}>
            API Key Required
          </h2>
          <p className="text-[var(--text-tertiary)] mb-6 leading-relaxed text-sm">
            To use Cultural Lens, you need a Google Gemini API key.
          </p>
          <div className="text-left glass-card p-5 mb-6">
            <p className="text-[var(--text-secondary)] text-sm mb-3 font-medium">Setup steps:</p>
            <ol className="text-[var(--text-tertiary)] text-sm space-y-2 list-decimal list-inside">
              <li>Get a key from <span className="text-[var(--text-primary)]">Google AI Studio</span></li>
              <li>Create a <code className="text-[var(--text-secondary)] bg-[var(--accent-dim)] px-1.5 py-0.5 rounded text-xs">.env</code> file in the project root</li>
              <li>Add: <code className="text-[var(--text-secondary)] bg-[var(--accent-dim)] px-1.5 py-0.5 rounded text-xs">VITE_GEMINI_KEY=your_key</code></li>
              <li>Restart the dev server</li>
            </ol>
          </div>
          <button onClick={handleBack} className="btn-secondary">
            Go Back
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="page-wrapper relative">
      <BackgroundEffects />
      <AnimatePresence mode="wait">
        {screen === 'landing' && (
          <LandingScreen
            key="landing"
            onUpload={(file) => goToCapture(file)}
            onCamera={goToCamera}
          />
        )}

        {screen === 'capture' && (
          <CaptureScreen
            key="capture"
            initialFile={selectedFile}
            onDiscover={handleDiscover}
            onBack={handleBack}
            loading={loading}
          />
        )}

        {screen === 'experience' && (
          <ExperienceScreen
            key="experience"
            result={result}
            imageUrl={imageUrl}
            onBack={handleBackToCapture}
          />
        )}
      </AnimatePresence>

      {/* Error overlay */}
      <AnimatePresence>
        {error && screen === 'capture' && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-card p-8 max-w-md w-full text-center"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="w-12 h-12 rounded-full border border-[var(--border-medium)] flex items-center justify-center mx-auto mb-5"
                   style={{ background: 'rgba(255,255,255,0.04)' }}>
                <AlertTriangle className="w-5 h-5 text-[var(--text-secondary)]" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-3" style={{ letterSpacing: '-0.02em' }}>
                Something went wrong
              </h3>
              <p className="text-[var(--text-tertiary)] text-sm mb-6 leading-relaxed">{error}</p>
              <div className="flex gap-3 justify-center">
                <button onClick={reset} className="btn-primary">
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <button onClick={handleBack} className="btn-secondary">
                  Go Home
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
