import { useState, useCallback, useEffect, useRef } from 'react';

const LANG_MAP = {
  english: 'en-IN',
  hindi: 'hi-IN',
  bengali: 'bn-IN',
};

export function useSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setIsSupported(false);
    }
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const speak = useCallback((text, language = 'english') => {
    if (!window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_MAP[language] || 'en-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.05;

    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const langCode = LANG_MAP[language] || 'en-IN';
    const matchedVoice = voices.find(v => v.lang === langCode) ||
      voices.find(v => v.lang.startsWith(langCode.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const pause = useCallback(() => {
    if (window.speechSynthesis?.speaking) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, []);

  const resume = useCallback(() => {
    if (window.speechSynthesis?.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  }, []);

  return { speak, pause, resume, stop, isSpeaking, isPaused, isSupported };
}
