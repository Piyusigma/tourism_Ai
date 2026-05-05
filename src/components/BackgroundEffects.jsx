import { useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function Particle({ mouseX, mouseY, index }) {
  // Deterministic "randomness" based on index so it doesn't shift on re-renders
  const offsetX = (index * 37) % 80 - 40; // -40px to 40px spread
  const offsetY = (index * 53) % 80 - 40;
  const size = (index % 3) + 1; // 1px to 3px
  const opacity = 0.2 + ((index % 5) * 0.1); // 0.2 to 0.6
  
  // Varying physics creates the fluid, swarming trail effect
  const stiffness = 15 + (index * 7) % 45; // 15 to 60
  const damping = 20 + (index * 3) % 20; // 20 to 40
  
  const x = useSpring(mouseX, { stiffness, damping });
  const y = useSpring(mouseY, { stiffness, damping });

  return (
    <motion.div
      className="absolute rounded-full z-10"
      style={{
        width: size,
        height: size,
        backgroundColor: `rgba(255, 255, 255, ${opacity})`,
        x,
        y,
        translateX: `${offsetX}px`,
        translateY: `${offsetY}px`,
        filter: size > 2 ? 'blur(1px)' : 'blur(0.5px)'
      }}
    />
  );
}

export default function BackgroundEffects() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the mouse tracking spotlight
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    // Initial center position
    mouseX.set(window.innerWidth / 2);
    mouseY.set(window.innerHeight / 2);

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black">
      {/* 1. The Moon Gradient (Static, large, atmospheric) */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] md:w-[1200px] md:h-[1200px] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(140, 180, 255, 0.12) 0%, rgba(100, 120, 255, 0.04) 35%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />
      
      {/* 2. The Mouse Tracking Spotlight (Antigravity effect) */}
      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full opacity-60"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }}
      />

      {/* 3. The Stardust Trail (20 Particles) */}
      {Array.from({ length: 20 }).map((_, i) => (
        <Particle key={i} index={i} mouseX={mouseX} mouseY={mouseY} />
      ))}
      
      {/* Film grain overlay for premium texture */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
      />
    </div>
  );
}
