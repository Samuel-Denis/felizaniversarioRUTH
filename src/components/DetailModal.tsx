import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: {
    cat: string;
    title: string;
    desc: string;
    color: string;
  } | null;
}

export function DetailModal({ isOpen, onClose, item }: DetailModalProps) {
  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-[92vw] sm:w-[90vw] md:w-[70vw] lg:w-[52rem] max-w-2xl max-h-[90vh] overflow-y-auto">
              <div
                className="glass rounded-3xl p-6 sm:p-8 relative overflow-hidden"
                style={{ boxShadow: `0 0 60px ${item.color}30` }}
              >
                {/* Glow de fundo */}
                <div
                  className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
                  style={{ background: item.color }}
                />
                <div
                  className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-30"
                  style={{ background: item.color }}
                />

                {/* Botão fechar */}
                <motion.button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5" />
                </motion.button>

                {/* Conteúdo */}
                <div className="relative z-10">
                  {/* Ícone */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring' }}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}40, ${item.color}20)`,
                      boxShadow: `0 0 30px ${item.color}40`
                    }}
                  >
                    <Sparkles className="w-8 h-8" style={{ color: item.color }} />
                  </motion.div>

                  {/* Categoria */}
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-block text-xs font-bold tracking-[0.2em] uppercase mb-3 px-3 py-1 rounded-full"
                    style={{
                      background: `${item.color}20`,
                      color: item.color
                    }}
                  >
                    {item.cat}
                  </motion.span>

                  {/* Título */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 sm:mb-4 text-center md:text-left"
                  >
                    {item.title}
                  </motion.h2>

                  {/* Descrição */}
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-white/85 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed md:leading-relaxed max-w-prose mx-auto md:mx-0 text-center md:text-left"
                  >
                    {item.desc}
                  </motion.p>

                  {/* Botão */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    onClick={onClose}
                    className="mt-8 w-full py-4 rounded-xl font-bold text-white transition-all"
                    style={{
                      background: `linear-gradient(135deg, ${item.color}, ${item.color}88)`,
                      boxShadow: `0 10px 30px ${item.color}40`
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Fechar
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
