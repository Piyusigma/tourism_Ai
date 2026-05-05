import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Camera,
  X,
  Search,
  ArrowLeft,
  ImageIcon,
  Loader2,
} from 'lucide-react';

export default function CaptureScreen({ onDiscover, onBack, initialFile, loading }) {
  const [file, setFile] = useState(initialFile || null);
  const [preview, setPreview] = useState(
    initialFile ? URL.createObjectURL(initialFile) : null
  );
  const [isDragOver, setIsDragOver] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Safely attach the camera stream once the video element is mounted
  useEffect(() => {
    if (showCamera && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(err => console.error('Video play error:', err));
    }
  }, [showCamera]);

  const handleFile = useCallback((f) => {
    if (f && f.type.startsWith('image/')) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const f = e.dataTransfer.files?.[0];
      handleFile(f);
    },
    [handleFile]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => setIsDragOver(false);

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = stream;
      setShowCamera(true);
    } catch (err) {
      console.error('Camera error:', err);
      alert('Unable to access camera. Please check permissions or try uploading a photo instead.');
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(
      (blob) => {
        const capturedFile = new File([blob], 'camera-capture.jpg', {
          type: 'image/jpeg',
        });
        handleFile(capturedFile);
        stopCamera();
      },
      'image/jpeg',
      0.9
    );
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  return (
    <motion.div
      className="page-wrapper items-center justify-center p-6 relative noise-bg"
      style={{ background: '#000' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Back button */}
      <motion.button
        id="capture-back-btn"
        onClick={onBack}
        className="absolute top-6 left-6 icon-btn z-20"
        initial={{ opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft className="w-4 h-4" />
      </motion.button>

      <div className="w-full max-w-2xl relative z-10">
        {/* Title */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2
            className="text-3xl md:text-4xl font-bold mb-3 text-[var(--text-primary)]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Capture a Moment
          </h2>
          <p className="text-[var(--text-quaternary)] text-sm">
            Upload or photograph a monument, artwork, or cultural landmark
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {showCamera ? (
            /* Camera View */
            <motion.div
              key="camera"
              className="glass-card p-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder corners */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-white/30 rounded-tl-lg" />
                <div className="absolute top-4 right-4 w-8 h-8 border-t border-r border-white/30 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-8 h-8 border-b border-l border-white/30 rounded-bl-lg" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-white/30 rounded-br-lg" />
              </div>

              <div className="flex justify-center gap-3 mt-4">
                <button
                  id="capture-take-photo-btn"
                  onClick={capturePhoto}
                  className="btn-primary"
                >
                  <Camera className="w-4 h-4" />
                  Capture
                </button>
                <button onClick={stopCamera} className="btn-secondary">
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : preview ? (
            /* Preview */
            <motion.div
              key="preview"
              className="glass-card p-4"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <div className="relative rounded-xl overflow-hidden">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full max-h-[400px] object-contain rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                />
                {/* Remove button */}
                <motion.button
                  onClick={clearFile}
                  className="absolute top-3 right-3 icon-btn"
                  style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex justify-center mt-6">
                <motion.button
                  id="capture-discover-btn"
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      // Provide audible feedback to guarantee the speech engine unlocks
                      // browsers block 'silent' hacks or empty strings.
                      const u = new SpeechSynthesisUtterance('Analyzing image...');
                      u.rate = 0.9;
                      window.speechSynthesis.speak(u);
                    }
                    onDiscover(file);
                  }}
                  disabled={loading}
                  className="btn-primary text-base px-8 py-4"
                  whileHover={!loading ? { scale: 1.02 } : {}}
                  whileTap={!loading ? { scale: 0.98 } : {}}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      Discover
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            /* Drop Zone */
            <motion.div
              key="dropzone"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
            >
              <div
                className={`drop-zone glass-card p-16 flex flex-col items-center justify-center text-center cursor-pointer ${
                  isDragOver ? 'drag-over' : ''
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <ImageIcon className="w-12 h-12 text-[var(--text-quaternary)] mb-6" />
                </motion.div>

                <p className="text-[var(--text-secondary)] text-base mb-2 font-medium">
                  Drag & drop an image here
                </p>
                <p className="text-[var(--text-quaternary)] text-sm mb-6">or click to browse</p>

                <div className="flex items-center gap-2 text-[var(--text-quaternary)] text-xs">
                  <Upload className="w-3 h-3" />
                  <span>JPG, PNG, WebP — Max 10MB</span>
                </div>

                <input
                  id="capture-file-input"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) handleFile(e.target.files[0]);
                  }}
                />
              </div>

              {/* Camera button below */}
              <motion.div className="flex justify-center mt-6">
                <button
                  id="capture-camera-btn"
                  onClick={startCamera}
                  className="btn-secondary"
                >
                  <Camera className="w-4 h-4" />
                  Use Camera Instead
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-[var(--text-quaternary)] text-[11px] tracking-widest uppercase">
        Cultural Lens
      </div>
    </motion.div>
  );
}
