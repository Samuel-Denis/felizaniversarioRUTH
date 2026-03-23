import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Story {
  cat: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

interface StoryViewerProps {
  stories: Story[];
  onComplete: () => void;
  onStoryView: (index: number) => void;
}

export function StoryViewer({ stories, onComplete, onStoryView }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const nextStory = useCallback(() => {
    confetti({
      particleCount: 20,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#ff5ea8', '#7c5cff', '#00d4ff', '#ffd700', '#ff8c42'],
    });

    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onComplete();
    }
  }, [currentIndex, stories.length, onComplete]);

  useEffect(() => {
    onStoryView(currentIndex);
    setProgress(100);
  }, [currentIndex, onStoryView]);

  const currentStory = stories[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative w-full max-w-lg mx-auto"
    >
      {/* Card principal */}
      <div
        className="glass rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden"
      >
        {/* Barra de progresso */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/10">
          <motion.div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${currentStory.color}, #fff)`
            }}
          />
        </div>

        {/* Indicadores de progresso */}
        <div className="flex gap-1 mb-6 mt-2">
          {stories.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-300 ${idx < currentIndex ? 'bg-white/60' :
                idx === currentIndex ? 'bg-white/30' : 'bg-white/10'
                }`}
            />
          ))}
        </div>

        {/* Conteúdo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Ícone animado */}
            <motion.div
              className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${currentStory.color}40, ${currentStory.color}20)`,
                boxShadow: `0 0 30px ${currentStory.color}40`
              }}
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div style={{ color: currentStory.color }}>
                {currentStory.icon}
              </div>
            </motion.div>

            {/* Categoria */}
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-4 py-1 rounded-full"
              style={{
                background: `${currentStory.color}20`,
                color: currentStory.color
              }}
            >
              {currentStory.cat}
            </motion.span>

            {/* Título */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4"
            >
              {currentStory.title}
            </motion.h2>

            {/* Descrição */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 text-base sm:text-lg leading-relaxed"
            >
              {currentStory.desc}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Botão próximo */}
        <motion.button
          onClick={nextStory}
          className="mt-8 mx-auto flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold text-white text-sm sm:text-base transition-all hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${currentStory.color}, ${currentStory.color}88)`,
            boxShadow: `0 10px 30px ${currentStory.color}40`
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {currentIndex < stories.length - 1 ? 'Próximo' : 'Finalizar'}
          <ChevronRight className="w-5 h-5" />
        </motion.button>

        {/* Contador */}
        <div className="mt-6 text-center text-white/40 text-sm">
          {currentIndex + 1} de {stories.length}
        </div>
      </div>

      {/* Glow effect */}
      <div
        className="absolute -inset-4 rounded-[2rem] opacity-30 blur-2xl -z-10"
        style={{ background: `radial-gradient(circle, ${currentStory.color}40, transparent)` }}
      />
    </motion.div>
  );
}
