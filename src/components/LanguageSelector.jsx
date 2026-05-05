import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { key: 'english', label: 'English', flag: '🇬🇧' },
  { key: 'hindi', label: 'हिन्दी', flag: '🇮🇳' },
  { key: 'bengali', label: 'বাংলা', flag: '🇮🇳' },
];

export default function LanguageSelector({ selected, onChange }) {
  return (
    <div className="flex items-center gap-6">
      <Globe className="w-6 h-6 text-[var(--text-quaternary)]" />
      <div className="flex items-center gap-2 rounded-full p-2 border border-[var(--border-subtle)]"
           style={{ background: 'rgba(255,255,255,0.02)' }}>
        {LANGUAGES.map((lang) => (
          <motion.button
            key={lang.key}
            id={`lang-btn-${lang.key}`}
            onClick={() => onChange(lang.key)}
            className={`px-6 py-2.5 text-base md:text-lg font-medium transition-all duration-300 flex items-center gap-3 rounded-full ${
              selected === lang.key
                ? 'bg-[rgba(255,255,255,0.12)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-quaternary)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)]'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-lg md:text-xl">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
