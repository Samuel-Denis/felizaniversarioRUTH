import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RUTH_BIRTH, RUTH_CELEBRATION } from '../lib/birthdate';

interface IntroAnimationProps {
  onComplete: () => void;
}

const BIRTH = RUTH_BIRTH;
const TODAY = RUTH_CELEBRATION;
/** Pausa com a data fixada no dia do aniversário (ms) */
const FREEZE_ON_BIRTHDAY_MS = 2000;

export function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [currentDate, setCurrentDate] = useState(() => new Date(BIRTH.getTime()));
  const [showWelcome, setShowWelcome] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef<number>(0);
  const animationRef = useRef<number | null>(null);
  const freezeStartedRef = useRef(false);
  const freezeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const welcomeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const duration = 4000;
      const progress = Math.min(elapsed / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      const currentTs = BIRTH.getTime() + (TODAY.getTime() - BIRTH.getTime()) * eased;
      setCurrentDate(new Date(currentTs));

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setCurrentDate(new Date(TODAY.getTime()));
        if (!freezeStartedRef.current) {
          freezeStartedRef.current = true;
          freezeTimeoutRef.current = window.setTimeout(() => {
            freezeTimeoutRef.current = null;
            setShowWelcome(true);
            const t1 = window.setTimeout(() => {
              setIsComplete(true);
              const t2 = window.setTimeout(onComplete, 500);
              welcomeTimeoutsRef.current.push(t2);
            }, 1500);
            welcomeTimeoutsRef.current.push(t1);
          }, FREEZE_ON_BIRTHDAY_MS);
        }
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (freezeTimeoutRef.current) {
        clearTimeout(freezeTimeoutRef.current);
      }
      welcomeTimeoutsRef.current.forEach(clearTimeout);
      welcomeTimeoutsRef.current = [];
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center"
          style={{
            background: 'radial-gradient(ellipse at center, #1a0b2e 0%, #050505 100%)',
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full border border-pink-500/20"
                style={{
                  width: 300 + i * 200,
                  height: 300 + i * 200,
                  left: '50%',
                  top: '50%',
                  marginLeft: -(150 + i * 100),
                  marginTop: -(150 + i * 100),
                }}
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  rotate: { duration: 20 + i * 5, repeat: Infinity, ease: 'linear' },
                  scale: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
                }}
              />
            ))}
          </div>

          <div className="relative z-10 text-center px-4">
            {!showWelcome ? (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <span className="text-pink-400 text-sm tracking-[0.3em] uppercase">
                    Calculando cada momento...
                  </span>
                </motion.div>

                <motion.div
                  className="text-5xl sm:text-6xl md:text-8xl font-black gradient-text mb-4"
                  style={{ fontFamily: 'system-ui' }}
                >
                  {currentDate.toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </motion.div>

                <div className="w-64 max-w-[85vw] h-1 bg-white/10 rounded-full mx-auto mt-8 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 4, ease: 'linear' }}
                  />
                </div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
              >
                <motion.div
                  className="text-7xl md:text-9xl font-black mb-4"
                  style={{
                    background: 'linear-gradient(135deg, #ff5ea8, #7c5cff, #00d4ff)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  ✨
                </motion.div>
                <motion.h1
                  className="text-4xl md:text-6xl font-bold text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Bem-vinda!
                </motion.h1>
                <motion.p
                  className="text-xl text-pink-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Hoje é um dia especial...
                </motion.p>
              </motion.div>
            )}
          </div>

          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#ff5ea8', '#7c5cff', '#00d4ff', '#ffd700'][i % 4],
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
