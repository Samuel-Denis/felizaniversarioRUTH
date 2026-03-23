import { motion } from 'framer-motion';
import {
  Sparkles, Heart, Calendar, Footprints, Users, BookOpen,
  Laugh, Zap, Eye, Utensils, Wind, Moon
} from 'lucide-react';
import type { Variants } from 'framer-motion';

interface TimelineItem {
  cat: string;
  title: string;
  desc: string;
  color: string;
  icon: React.ReactNode;
}

interface TimelineGridProps {
  items: TimelineItem[];
  visibleItems: number[];
  onItemClick: (item: TimelineItem) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  'DIAS VIVIDOS': <Calendar className="w-6 h-6" />,
  'SEMANAS': <Sparkles className="w-6 h-6" />,
  'MESES': <Moon className="w-6 h-6" />,
  'EQUILÍBRIO': <Zap className="w-6 h-6" />,
  'BATIDAS': <Heart className="w-6 h-6" />,
  'SABORES': <Utensils className="w-6 h-6" />,
  'CAMINHADA': <Footprints className="w-6 h-6" />,
  'RESPIRAÇÃO': <Wind className="w-6 h-6" />,
  'VISÃO': <Eye className="w-6 h-6" />,
  'CONEXÕES': <Users className="w-6 h-6" />,
  'SABEDORIA': <BookOpen className="w-6 h-6" />,
  'HUMOR': <Laugh className="w-6 h-6" />,
  'OFF-SCRIPT': <Zap className="w-6 h-6" />,
};

export function TimelineGrid({ items, visibleItems, onItemClick }: TimelineGridProps) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 12,
      }
    },
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Título da seção */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <span className="text-pink-400 text-sm tracking-[0.3em] uppercase mb-4 block">
          Sua Jornada
        </span>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
          Linha do Tempo
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          Cada momento conta. Clique nos cards para relembrar essas conquistas!
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {items.map((item, index) => {
          const isVisible = visibleItems.includes(index);

          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative group cursor-pointer ${!isVisible ? 'opacity-50' : ''}`}
              onClick={() => isVisible && onItemClick(item)}
              whileHover={isVisible ? { scale: 1.05, y: -5 } : undefined}
              whileTap={isVisible ? { scale: 0.95 } : undefined}
            >
              <div
                className={`
                  glass rounded-2xl p-4 sm:p-5 h-full transition-all duration-300
                  ${isVisible ? 'hover:shadow-2xl cursor-pointer' : 'cursor-default'}
                `}
                style={{
                  boxShadow: isVisible ? `0 0 20px ${item.color}20` : 'none',
                }}
              >
                {/* Ícone */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    background: `linear-gradient(135deg, ${item.color}30, ${item.color}10)`,
                    color: item.color
                  }}
                >
                  {iconMap[item.cat] || <Sparkles className="w-6 h-6" />}
                </div>

                {/* Categoria */}
                <span
                  className="text-xs font-bold tracking-wider uppercase mb-2 block"
                  style={{ color: item.color }}
                >
                  {item.cat}
                </span>

                {/* Título */}
                <h3 className="text-white font-bold text-base sm:text-lg leading-tight">
                  {item.title}
                </h3>

                {/* Indicador de bloqueio */}
                {!isVisible && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <span className="text-white/60 text-lg">🔒</span>
                    </div>
                  </div>
                )}

                {/* Efeito de hover */}
                {isVisible && (
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity -z-10"
                    style={{
                      background: `radial-gradient(circle at center, ${item.color}20, transparent)`,
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
