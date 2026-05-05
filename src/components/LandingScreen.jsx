import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, Sparkles } from 'lucide-react';

export default function LandingScreen({ onUpload, onCamera }) {
  const fullText = "Cultural Lens";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="page-wrapper min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden bg-transparent"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >

      {/* Main content */}
      <div className="relative z-10 text-center px-6 w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-subtle)] mb-8 md:mb-10"
          style={{ background: 'rgba(255,255,255,0.03)' }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          <span className="text-[10px] md:text-xs text-[var(--text-tertiary)] font-medium tracking-[0.15em] uppercase">
            AI-Powered Cultural Discovery
          </span>
        </motion.div>

        {/* Title */}
        <h1
          className="font-extrabold mb-8 leading-[1.0] text-6xl sm:text-7xl md:text-8xl lg:text-[140px] flex items-center justify-center min-h-[140px]"
          style={{ letterSpacing: '-0.04em' }}
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/30 drop-shadow-sm">
            {typedText}
          </span>
          <span className="animate-pulse inline-block w-[2px] md:w-[4px] h-[45px] sm:h-[65px] md:h-[95px] lg:h-[120px] bg-white ml-2 align-baseline shadow-[0_0_15px_rgba(255,255,255,0.8)] rounded-full" />
        </h1>

        {/* Tagline */}
        <motion.p
          className="text-[var(--text-quaternary)] font-semibold uppercase mb-6 md:mb-8 text-[10px] sm:text-xs md:text-sm tracking-[0.4em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Point // Discover // Experience
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-white/60 font-light max-w-sm md:max-w-md mx-auto mb-12 text-sm md:text-lg leading-[1.8]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
        >
          Capture any monument, artwork, or cultural landmark and let AI unveil its
          story through an immersive cinematic narration.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
        >
          <label className="btn-primary cursor-pointer w-full sm:w-auto text-center group">
            <Upload className="w-4 h-4 transition-transform group-hover:scale-110" />
            Upload Photo
            <input
              id="landing-upload-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) onUpload(e.target.files[0]);
              }}
            />
          </label>

          <button id="landing-camera-btn" onClick={onCamera} className="btn-secondary w-full sm:w-auto group">
            <Camera className="w-4 h-4 transition-transform group-hover:scale-110" />
            Use Camera
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        className="absolute bottom-6 md:bottom-8 left-0 right-0 text-center text-[var(--text-quaternary)] text-[10px] md:text-[11px] tracking-widest uppercase"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6 }}
      >
        Cultural Lens
      </motion.div>
    </motion.div>
  );
}
