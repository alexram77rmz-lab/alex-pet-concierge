import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

/**
 * Tarjeta con inclinación 3D que sigue el mouse + brillo suave.
 * Solo reacciona a mouse/lápiz (en celular no estorba al scroll) y respeta "reducir movimiento".
 */
export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', maxTilt = 8 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glow = useMotionTemplate`radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.22), transparent 55%)`;
  const glowOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 25 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * 2 * maxTilt);
    rx.set(-(py - 0.5) * 2 * maxTilt);
    gx.set(px * 100);
    gy.set(py * 100);
    glowOpacity.set(1);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    glowOpacity.set(0);
  };

  return (
    <div style={{ perspective: 900 }} className={className}>
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }}
        className="relative h-full will-change-transform"
      >
        {children}
        <motion.div
          aria-hidden="true"
          style={{ background: glow, opacity: glowOpacity }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
        />
      </motion.div>
    </div>
  );
};
