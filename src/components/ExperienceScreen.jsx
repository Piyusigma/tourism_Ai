import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  MapPin,
  Lightbulb,
  Clock,
  Share2,
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import VoicePlayer from './VoicePlayer';
import Timeline from './Timeline';
import LanguageSelector from './LanguageSelector';
import { useSpeech } from '../hooks/useSpeech';

function FadeIn({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ExperienceScreen({ result, imageUrl, onBack }) {
  const [language, setLanguage] = useState('english');
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [copied, setCopied] = useState(false);
  const { speak, pause, resume, stop, isSpeaking, isPaused, isSupported } = useSpeech();
  const typingRef = useRef(null);
  const hasSpokenName = useRef(false);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroImageY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    if (result && !hasSpokenName.current) {
      hasSpokenName.current = true;
      speak(`This is ${result.name}`, 'english');
    }
  }, [result, speak]);

  useEffect(() => {
    return () => { stop(); };
  }, [stop]);

  const getNarration = useCallback(() => {
    if (!result) return '';
    switch (language) {
      case 'hindi': return result.hindiNarration || result.narration;
      case 'bengali': return result.bengaliNarration || result.narration;
      default: return result.narration;
    }
  }, [result, language]);

  useEffect(() => {
    const narration = getNarration();
    if (!narration) return;
    
    // Clean up "undefined" or weird artifacts at the end of the API response if they exist
    const cleanNarration = narration.replace(/undefined/gi, '').trim();
    
    setDisplayedText('');
    setIsTyping(true);
    let i = 0;
    const words = cleanNarration.split(' ');
    typingRef.current = setInterval(() => {
      if (i < words.length) {
        setDisplayedText((prev) => (prev ? prev + ' ' + words[i] : words[i]));
        i++;
      } else {
        clearInterval(typingRef.current);
        setIsTyping(false);
      }
    }, 60);
    return () => { if (typingRef.current) clearInterval(typingRef.current); };
  }, [getNarration, language]);

  const handlePlay = () => { speak(getNarration(), language); };

  const handleShare = async () => {
    const text = `🏛️ ${result.name}\n📍 ${result.location}\n\n${result.narration.substring(0, 200)}...\n\n— Discovered with Cultural Lens`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!result) return null;

  return (
    <motion.div
      className="min-h-[100dvh] bg-black text-[var(--text-1)] overflow-x-hidden pb-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* ===== FIXED HEADER ===== */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl border-b border-[var(--border-subtle)] bg-black/70">
        <div className="w-full px-6 py-3 flex items-center justify-between">
          <motion.button
            id="experience-back-btn"
            onClick={() => { stop(); onBack(); }}
            className="icon-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.button>
          <span className="text-[10px] sm:text-[11px] font-semibold text-[var(--text-tertiary)] tracking-[0.15em] uppercase">
            Cultural Lens
          </span>
          <motion.button
            id="experience-share-btn"
            onClick={handleShare}
            className="icon-btn"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {copied ? <CheckCircle className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* ===== FULL VIEWPORT HERO ===== */}
      <section ref={heroRef} className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        {/* Blurred ambient background */}
        <motion.div className="absolute inset-0 z-0" style={{ y: heroImageY }}>
          <div
            className="absolute inset-0 scale-125"
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(60px) brightness(0.2) saturate(1.4)',
            }}
          />
        </motion.div>

        {/* Gradient overlays */}
        <div className="absolute inset-0 z-[1] bg-gradient-to-b from-black/50 via-transparent to-black" />

        {/* Hero content */}
        <motion.div className="relative z-10 text-center px-6 w-full flex flex-col items-center mt-12" style={{ opacity: heroOpacity }}>
          {/* Image Thumbnail */}
          <motion.div
            className="w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-[320px] lg:h-[320px] rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] mb-8 md:mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <img src={imageUrl} alt={result.name} className="w-full h-full object-cover" />
          </motion.div>

          {/* Monument Name */}
          <motion.h1
            className="font-bold text-[var(--text-primary)] mb-6 md:mb-8 leading-[1.05] tracking-tight max-w-[90vw]"
            style={{
              fontSize: 'clamp(2.5rem, 8vw, 6rem)',
              fontFamily: "'Playfair Display', serif",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            {result.name}
          </motion.h1>

          {/* Location Badge (Made Bigger) */}
          <motion.div
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <MapPin className="w-5 h-5 text-[var(--text-tertiary)]" />
            <span className="text-[var(--text-primary)] text-lg md:text-xl font-medium tracking-wide">{result.location}</span>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            className="mt-12 md:mt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div
              className="w-px h-16 mx-auto bg-gradient-to-b from-white/30 to-transparent"
              animate={{ scaleY: [1, 0.4, 1], transformOrigin: 'top' }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ===== MAIN CONTENT EXPANSIVE CONTAINER ===== */}
      <div className="w-full px-6 md:px-12 lg:px-24 mx-auto max-w-screen-2xl">
        
        {/* Controls Bar */}
        <FadeIn className="mb-16 md:mb-24">
          <div className="glass-card p-4 md:p-6 w-full flex flex-col sm:flex-row items-center justify-between gap-6 relative z-20 -mt-10">
            <LanguageSelector selected={language} onChange={setLanguage} />
            <VoicePlayer
              onPlay={handlePlay}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              isSpeaking={isSpeaking}
              isPaused={isPaused}
              isSupported={isSupported}
            />
          </div>
        </FadeIn>

        {/* ===== NARRATION ===== */}
        <FadeIn className="mb-24 md:mb-32">
          <div className="w-full">
            <div className="flex items-center gap-2.5 text-[var(--text-tertiary)] border-b border-white/10 pb-4 mb-8 md:mb-12">
              <Sparkles className="w-5 h-5" />
              <h3 className="text-sm md:text-base font-semibold tracking-widest uppercase m-0">The Story</h3>
            </div>
            <p
              className={`text-[var(--text-secondary)] text-xl md:text-3xl lg:text-4xl leading-[1.6] md:leading-[1.7] tracking-tight whitespace-pre-line font-light w-full ${
                isTyping ? 'typewriter-cursor' : ''
              }`}
            >
              {displayedText}
            </p>
          </div>
        </FadeIn>

        {/* ===== FUN FACTS ===== */}
        {result.funFacts?.length > 0 && (
          <FadeIn className="mb-24 md:mb-32">
            <div className="w-full">
              <div className="flex items-center gap-2.5 text-[var(--text-tertiary)] border-b border-white/10 pb-4 mb-8 md:mb-12">
                <Lightbulb className="w-5 h-5" />
                <h3 className="text-sm md:text-base font-semibold tracking-widest uppercase m-0">Discoveries</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
                {result.funFacts.map((fact, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="glass-card p-8 h-full group hover:border-[var(--border-medium)] transition-all duration-500 hover:bg-white/5 flex flex-col">
                      <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center mb-6 group-hover:border-white/20 transition-colors">
                        <span className="text-lg text-[var(--text-tertiary)] font-semibold">{i + 1}</span>
                      </div>
                      <p className="text-[var(--text-secondary)] text-lg md:text-xl leading-relaxed group-hover:text-white transition-colors duration-300">
                        {fact}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        )}

        {/* ===== TIMELINE ===== */}
        {result.timeline?.length > 0 && (
          <FadeIn className="mb-24 md:mb-32">
            <div className="w-full">
              <div className="flex items-center gap-2.5 text-[var(--text-tertiary)] border-b border-white/10 pb-4 mb-8 md:mb-12">
                <Clock className="w-5 h-5" />
                <h3 className="text-sm md:text-base font-semibold tracking-widest uppercase m-0">Timeline</h3>
              </div>
              <div className="w-full">
                <Timeline timeline={result.timeline} />
              </div>
            </div>
          </FadeIn>
        )}

        {/* ===== FOOTER ===== */}
        <FadeIn className="pt-12 md:pt-24 flex flex-col items-center gap-12 border-t border-white/10">
          <button
            id="experience-try-again-btn"
            onClick={() => { stop(); onBack(); }}
            className="btn-secondary group px-10 py-5 text-xl"
          >
            <RotateCcw className="w-6 h-6 group-hover:-rotate-90 transition-transform duration-500" />
            Explore Another
          </button>
          <div className="text-[var(--text-quaternary)] text-sm tracking-[0.2em] uppercase">
            Cultural Lens
          </div>
        </FadeIn>

      </div>
    </motion.div>
  );
}
