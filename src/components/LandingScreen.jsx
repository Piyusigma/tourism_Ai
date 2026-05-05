import { motion } from 'framer-motion';
import { Camera, Upload, Sparkles } from 'lucide-react';

export default function LandingScreen({ onUpload, onCamera }) {
  return (
    <motion.div
      className="page-wrapper min-h-[100dvh] flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Subtle ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[800px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 65%)',
        }}
      />

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
        <motion.h1
          className="font-bold mb-6 leading-[0.95] text-6xl sm:text-7xl md:text-8xl lg:text-[140px]"
          style={{ letterSpacing: '-0.04em' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="text-[var(--text-primary)] block">Cultural</span>
          <span className="text-[var(--text-tertiary)] block -mt-1 md:-mt-4">Lens.</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          className="text-[var(--text-tertiary)] font-light uppercase mb-6 md:mb-8 text-xs sm:text-sm md:text-base tracking-[0.2em]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          Point. Discover. Experience.
        </motion.p>

        {/* Description */}
        <motion.p
          className="text-[var(--text-quaternary)] max-w-sm md:max-w-md mx-auto mb-10 text-sm md:text-lg leading-relaxed"
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
