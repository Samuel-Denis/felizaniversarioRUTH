import { motion } from 'framer-motion';
import { 
  Sparkles, Heart, Calendar, Footprints, Users, BookOpen, 
  Laugh, Zap, Eye, Utensils, Wind, Moon 
} from 'lucide-react';
import { useMemo } from 'react';
import type { Variants } from 'framer-motion';

interface ConstellationItem {
  cat: string;
  title: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
}

interface ConstellationMapProps {
  items: ConstellationItem[];
  visibleItems: number[];
  onItemClick: (item: ConstellationItem) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'DIAS': <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />,
  'SEMANAS': <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />,
  'MESES': <Moon className="w-4 h-4 sm:w-5 sm:h-5" />,
  'EQUILÍBRIO': <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
  'BATIDAS': <Heart className="w-4 h-4 sm:w-5 sm:h-5" />,
  'SABORES': <Utensils className="w-4 h-4 sm:w-5 sm:h-5" />,
  'CAMINHADA': <Footprints className="w-4 h-4 sm:w-5 sm:h-5" />,
  'RESPIRAÇÃO': <Wind className="w-4 h-4 sm:w-5 sm:h-5" />,
  'VISÃO': <Eye className="w-4 h-4 sm:w-5 sm:h-5" />,
  'CONEXÕES': <Users className="w-4 h-4 sm:w-5 sm:h-5" />,
  'SABEDORIA': <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />,
  'HUMOR': <Laugh className="w-4 h-4 sm:w-5 sm:h-5" />,
  'OFF-SCRIPT': <Zap className="w-4 h-4 sm:w-5 sm:h-5" />,
};

const basePositions = [
  { x: 12, y: 18 }, { x: 30, y: 10 }, { x: 48, y: 20 }, { x: 68, y: 12 },
  { x: 84, y: 26 }, { x: 70, y: 40 }, { x: 52, y: 34 }, { x: 34, y: 42 },
  { x: 16, y: 36 }, { x: 22, y: 58 }, { x: 40, y: 70 }, { x: 62, y: 66 },
  { x: 82, y: 58 }, { x: 70, y: 82 }, { x: 44, y: 86 },
];

export function ConstellationMap({ items, visibleItems, onItemClick }: ConstellationMapProps) {
  const positions = useMemo(() => {
    return items.map((_, index) => {
      const base = basePositions[index % basePositions.length];
      return {
        x: base.x + ((index * 7) % 5),
        y: base.y + ((index * 11) % 5),
      };
    });
  }, [items]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const pointVariants: Variants = {
    hidden: { opacity: 0, scale: 0.7 },
    visible: { opacity: 1, scale: 1 },
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-10"
      >
        <span className="text-pink-400 text-sm tracking-[0.3em] uppercase mb-4 block">
          Sua Jornada
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Constelação de Momentos
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Toque nos pontos iluminados para abrir cada mensagem especial.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="relative w-full h-[520px] sm:h-[560px] md:h-[620px] rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 glass rounded-3xl" />

        <svg className="absolute inset-0 w-full h-full">
          {items.map((_, index) => {
            if (!visibleItems.includes(index)) return null;
            const current = positions[index];
            const next = positions[index + 1];
            if (!next || !visibleItems.includes(index + 1)) return null;

            return (
              <line
                key={`line-${index}`}
                x1={`${current.x}%`}
                y1={`${current.y}%`}
                x2={`${next.x}%`}
                y2={`${next.y}%`}
                stroke="rgba(255, 255, 255, 0.18)"
                strokeWidth="1.5"
              />
            );
          })}
        </svg>

        {items.map((item, index) => {
          const isVisible = visibleItems.includes(index);
          const position = positions[index];

          return (
            <motion.button
              key={index}
              variants={pointVariants}
              type="button"
              onClick={() => isVisible && onItemClick(item)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all ${
                isVisible ? 'cursor-pointer' : 'cursor-default'
              }`}
              style={{ left: `${position.x}%`, top: `${position.y}%` }}
              whileHover={isVisible ? { scale: 1.08 } : undefined}
              whileTap={isVisible ? { scale: 0.95 } : undefined}
            >
              <div
                className={`relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full ${
                  isVisible ? 'shadow-2xl' : 'opacity-40'
                }`}
                style={{
                  background: isVisible
                    ? `radial-gradient(circle, ${item.color}55 0%, ${item.color}20 60%, transparent 70%)`
                    : 'rgba(255, 255, 255, 0.08)',
                  boxShadow: isVisible ? `0 0 20px ${item.color}66` : 'none',
                }}
              >
                <div
                  className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full"
                  style={{
                    background: isVisible ? item.color : 'rgba(255,255,255,0.15)',
                    color: '#050505',
                  }}
                >
                  {iconMap[item.cat] || <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                {isVisible && (
                  <div
                    className="absolute -inset-2 rounded-full opacity-30 blur-md"
                    style={{ background: item.color }}
                  />
                )}
              </div>

              <div className="mt-2 text-center">
                <span
                  className={`block text-[10px] sm:text-xs font-bold tracking-wider uppercase ${
                    isVisible ? 'text-white/80' : 'text-white/30'
                  }`}
                >
                  {item.cat}
                </span>
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
