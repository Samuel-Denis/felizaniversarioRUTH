import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, HelpCircle, Gamepad2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BirthdayQuizModal } from './BirthdayQuizModal';
import { AgeRunnerGame } from './AgeRunnerGame';
import ruthAvatar from './images/ruth_avatar.png';

interface FinalCelebrationProps {
  totalDays: number;
  ageYears: number;
}

export function FinalCelebration({ totalDays, ageYears }: FinalCelebrationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [quizOpen, setQuizOpen] = useState(false);
  const [runnerOpen, setRunnerOpen] = useState(false);

  useEffect(() => {
    const duration = 5000;
    const end = Date.now() + duration;

    const colors = ['#ff5ea8', '#7c5cff', '#00d4ff', '#ffd700', '#ff8c42'];

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, []);

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex flex-col items-center justify-start px-4 relative overflow-hidden py-10"
    >
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2"
            style={{
              width: 200 + i * 150,
              height: 200 + i * 150,
              left: '50%',
              top: '20%',
              marginLeft: -(100 + i * 75),
              marginTop: -(100 + i * 75),
              borderColor: `rgba(255, 94, 168, ${0.1 - i * 0.02})`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {[...Array(30)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center w-full max-w-4xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 15, stiffness: 100 }}
          className="mb-6"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            className="mx-auto h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 p-[3px] shadow-2xl"
          >
            <div className="h-full w-full overflow-hidden rounded-full bg-[#1a0b2e]">
              <img
                src={ruthAvatar}
                alt="Ruth"
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            </div>
          </motion.div>
        </motion.div>

        <div className="min-h-[140px] sm:min-h-[180px] flex items-center justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-4"
          >
            <motion.h2
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              ✨ Parabéns, Ruth! ✨
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto"
            >
              Em meio a infinitas estrelas, hoje celebramos a luz única que você emana. Que este novo ciclo traga a coragem necessária para conquistar cada sonho que o seu universo particular guarda.
            </motion.p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="flex flex-wrap justify-center gap-4 mb-6"
        >
          {[
            { value: String(ageYears), label: 'Anos', color: '#7c5cff' },
            { value: '∞', label: 'Possibilidades', color: '#00d4ff' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="glass rounded-2xl px-6 py-3 text-center"
              whileHover={{ scale: 1.05 }}
            >
              <div
                className="text-xl sm:text-2xl md:text-3xl font-black"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-white/50 text-xs uppercase tracking-wider">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="mb-8 flex flex-wrap items-center justify-center gap-3"
        >
          <motion.button
            type="button"
            onClick={() => {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#ff5ea8', '#7c5cff', '#00d4ff', '#ffd700'],
              });
            }}
            className="px-6 py-3 rounded-full font-bold text-white text-sm sm:text-base transition-all hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #ff5ea8, #7c5cff)',
              boxShadow: '0 10px 40px rgba(255, 94, 168, 0.4)',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Celebrar!
              <Star className="w-4 h-4" />
            </span>
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setQuizOpen(true)}
            className="flex items-center gap-2 rounded-full border-2 border-white/25 bg-white/10 px-6 py-3 font-bold text-white text-sm backdrop-blur-sm transition-all hover:bg-white/15 sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <HelpCircle className="h-4 w-4 shrink-0" />
            Quiz
          </motion.button>

          <motion.button
            type="button"
            onClick={() => setRunnerOpen(true)}
            className="flex items-center gap-2 rounded-full border-2 border-cyan-400/35 bg-cyan-500/15 px-6 py-3 font-bold text-white text-sm backdrop-blur-sm transition-all hover:bg-cyan-500/25 sm:text-base"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Gamepad2 className="h-4 w-4 shrink-0" />
            Corrida
          </motion.button>
        </motion.div>

        <BirthdayQuizModal
          open={quizOpen}
          onClose={() => setQuizOpen(false)}
          ageYears={ageYears}
        />

        <AgeRunnerGame
          open={runnerOpen}
          onClose={() => setRunnerOpen(false)}
          avatarSrc={ruthAvatar}
          targetAge={ageYears}
        />
      </div>
    </motion.div>
  );
}
