import { motion } from 'framer-motion';
import { Play, Pause, Square } from 'lucide-react';

export default function VoicePlayer({
  onPlay,
  onPause,
  onResume,
  onStop,
  isSpeaking,
  isPaused,
  isSupported,
}) {
  if (!isSupported) return null;

  return (
    <div className="flex items-center gap-2.5">
      {/* Sound wave bars - visible when speaking and not paused */}
      {isSpeaking && !isPaused && (
        <motion.div
          className="sound-wave mr-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="sound-bar" />
          ))}
        </motion.div>
      )}

      {/* Play / Pause */}
      {!isSpeaking ? (
        <motion.button
          id="voice-play-btn"
          onClick={onPlay}
          className="icon-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title="Play narration"
        >
          <Play className="w-4 h-4 ml-0.5" />
        </motion.button>
      ) : isPaused ? (
        <motion.button
          id="voice-resume-btn"
          onClick={onResume}
          className="icon-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title="Resume narration"
        >
          <Play className="w-4 h-4 ml-0.5" />
        </motion.button>
      ) : (
        <motion.button
          id="voice-pause-btn"
          onClick={onPause}
          className="icon-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title="Pause narration"
        >
          <Pause className="w-4 h-4" />
        </motion.button>
      )}

      {/* Stop */}
      {isSpeaking && (
        <motion.button
          id="voice-stop-btn"
          onClick={onStop}
          className="icon-btn"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          title="Stop narration"
        >
          <Square className="w-3.5 h-3.5" />
        </motion.button>
      )}
    </div>
  );
}
