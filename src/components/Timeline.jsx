import { motion } from 'framer-motion';

export default function Timeline({ timeline = [] }) {
  if (!timeline.length) return null;

  return (
    <div className="relative pl-8">
      {/* Vertical gradient line */}
      <div className="timeline-line" />

      <div className="space-y-5">
        {timeline.map((item, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-4 relative"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.15, duration: 0.4 }}
          >
            {/* Dot */}
            <div className="timeline-dot -ml-8" />

            {/* Content */}
            <div className="glass-card p-4 flex-1 group cursor-default transition-all duration-300 hover:border-[var(--border-medium)]">
              <span className="text-[var(--text-secondary)] font-semibold text-xs tracking-wider font-mono uppercase">
                {item.year}
              </span>
              <p className="text-[var(--text-tertiary)] text-sm mt-1.5 leading-relaxed group-hover:text-[var(--text-secondary)] transition-colors">
                {item.event}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
