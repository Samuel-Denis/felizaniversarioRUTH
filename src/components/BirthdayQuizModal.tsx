import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const LETTERS = ['A', 'B', 'C', 'D'] as const;

type QuizItem = {
  /** Texto da pergunta (índice 0 usa template com idade no componente) */
  question: string;
  options: [string, string, string, string];
  /** 0=A, 1=B, 2=C, 3=D */
  correctIndex: 0 | 1 | 2 | 3;
  /** Texto da resposta certa (igual ao que tinhas antes) */
  answerSummary: string;
};

const QUIZ_ITEMS: QuizItem[] = [
  {
    question: '',
    options: [
      'Mais de 10.227 dias',
      'Cerca de 8.200 dias',
      'Exatamente 10.000 dias',
      'Menos de 6.000 dias',
    ],
    correctIndex: 0,
    answerSummary: 'Mais de 10.227 dias',
  },
  {
    question: 'Quantas horas já se passaram desde o seu nascimento?',
    options: [
      'Cerca de 120 mil horas',
      'Menos de 80 mil horas',
      'Mais de 245 mil horas',
      'Mais de 1 milhão de horas',
    ],
    correctIndex: 2,
    answerSummary: 'Mais de 245 mil horas',
  },
  {
    question: '245 mil horas é equivalente a quantos minutos?',
    options: [
      'Menos de 500 mil minutos',
      'Mais de 14,7 milhões de minutos',
      'Cerca de 1 milhão de minutos',
      'Mais de 100 milhões de minutos',
    ],
    correctIndex: 1,
    answerSummary: 'Mais de 14,7 milhões de minutos',
  },
  {
    question: '14,7 milhões de minutos é equivalente a quantos segundos?',
    options: [
      'Mais de 883 milhões de segundos',
      'Cerca de 100 milhões de segundos',
      'Menos de 50 milhões de segundos',
      'Mais de 5 bilhões de segundos',
    ],
    correctIndex: 0,
    answerSummary: 'Mais de 883 milhões de segundos',
  },
  {
    question: 'Quantas vezes seu coração já bateu?',
    options: [
      'Cerca de 500 milhões de vezes',
      'Menos de 1 bilhão de vezes',
      'Mais de 20 bilhões de vezes',
      'Mais de 3,7 bilhões de batimentos ❤️',
    ],
    correctIndex: 3,
    answerSummary: 'Mais de 3,7 bilhões de batimentos ❤️',
  },
  {
    question: 'Quantas segundas-feiras você já enfrentou?',
    options: [
      'Cerca de 500 segundas',
      'Mais de 3.000 segundas',
      'Mais de 1.460 segundas 😅',
      'Menos de 200 segundas',
    ],
    correctIndex: 2,
    answerSummary: 'Mais de 1.460 segundas 😅',
  },
  {
    question: 'E quantas sextas chegaram para te salvar?',
    options: [
      'Mais de 1.460 sextas 😎',
      'Cerca de 400 sextas',
      'Menos de 100 sextas',
      'Mais de 5.000 sextas',
    ],
    correctIndex: 0,
    answerSummary: 'Mais de 1.460 sextas 😎',
  },
  {
    question: 'Quantas refeições você já fez?',
    options: [
      'Cerca de 5 mil refeições',
      'Menos de 1 mil refeições',
      'Mais de 100 mil refeições',
      'Mais de 30 mil refeições 🍽️',
    ],
    correctIndex: 3,
    answerSummary: 'Mais de 30 mil refeições 🍽️',
  },
  {
    question: 'Quantas vezes você já foi ao trono refletir sobre a vida?',
    options: [
      'Menos de 100 vezes 🚽😂',
      'Mais de 10 mil reflexões profundas 🚽😂',
      'Cerca de 100 mil vezes 🚽😂',
      'Exatamente 1.000 vezes 🚽😂',
    ],
    correctIndex: 1,
    answerSummary: 'Mais de 10 mil reflexões profundas 🚽😂',
  },
  {
    question: 'Aproximadamente passou 33% da sua vida dormindo, quantas horas isso representa?',
    options: [
      'Cerca de 10 mil horas',
      'Menos de 5 mil horas',
      'Mais de 200 mil horas',
      'Mais de 81 mil horas 😴',
    ],
    correctIndex: 3,
    answerSummary: 'Mais de 81 mil horas 😴',
  },
];

/** Após marcar alternativa, avança sozinho (ms) */
const AUTO_NEXT_MS = 2000;

const FINAL_LINES = [
  'E no meio de todos esses números...',
  'o mais incrível é que cada segundo construiu a pessoa maravilhosa que você é hoje.',
  'Feliz aniversário, Ruth ❤️',
];

interface BirthdayQuizModalProps {
  open: boolean;
  onClose: () => void;
  ageYears?: number;
}

export function BirthdayQuizModal({ open, onClose, ageYears = 28 }: BirthdayQuizModalProps) {
  const [stage, setStage] = useState<'quiz' | 'final'>('quiz');
  const [index, setIndex] = useState(0);
  /** Índice da alternativa escolhida (0–3), null = ainda não marcou */
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);

  const reset = useCallback(() => {
    setStage('quiz');
    setIndex(0);
    setPickedIndex(null);
  }, []);

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const item = QUIZ_ITEMS[index];
  const isLast = index >= QUIZ_ITEMS.length - 1;
  const revealed = pickedIndex !== null;

  const questionText =
    index === 0
      ? `Hoje você não completa só ${ageYears} anos… quantos dias você já viveu?`
      : item?.question ?? '';

  const handlePick = (optionIndex: number) => {
    if (pickedIndex !== null) return;
    setPickedIndex(optionIndex);
  };

  const handleNext = useCallback(() => {
    setIndex((i) => {
      if (i >= QUIZ_ITEMS.length - 1) {
        setStage('final');
        return i;
      }
      setPickedIndex(null);
      return i + 1;
    });
  }, []);

  useEffect(() => {
    if (pickedIndex === null || stage !== 'quiz') return;
    const id = window.setTimeout(() => {
      handleNext();
    }, AUTO_NEXT_MS);
    return () => clearTimeout(id);
  }, [pickedIndex, stage, handleNext]);

  const optionClass = (i: number) => {
    if (!revealed) {
      return 'border-white/20 bg-white/5 hover:border-pink-400/50 hover:bg-white/10';
    }
    const isCorrect = i === item.correctIndex;
    const isPicked = i === pickedIndex;
    if (isCorrect) {
      return 'border-emerald-400/80 bg-emerald-500/20 ring-1 ring-emerald-400/40';
    }
    if (isPicked && !isCorrect) {
      return 'border-red-400/80 bg-red-500/15 ring-1 ring-red-400/30';
    }
    return 'border-white/10 bg-white/[0.03] opacity-45';
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="birthday-quiz-root"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div
            role="presentation"
            aria-hidden
            className="absolute inset-0 cursor-default bg-black/75 backdrop-blur-md"
            onClick={onClose}
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mini prova de aniversário"
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="pointer-events-auto relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#12121a]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/70 transition hover:bg-white/20 hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <AnimatePresence mode="wait">
                {stage === 'quiz' && item && (
                  <motion.div
                    key={`q-${index}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.35, ease: 'easeOut' }}
                  >
                    <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
                      Mini prova
                    </p>
                    <p className="mb-4 text-center text-sm text-white/50">
                      Questão {index + 1} de {QUIZ_ITEMS.length}
                    </p>

                    <h2
                      id="quiz-question-text"
                      className="mb-6 text-center text-base font-bold leading-snug text-white sm:text-lg"
                    >
                      {questionText}
                    </h2>

                    <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-white/40">
                      Marque a alternativa correta
                    </p>

                    <div className="flex flex-col gap-2.5 sm:gap-3">
                      {item.options.map((text, i) => {
                        const letter = LETTERS[i];
                        return (
                          <motion.button
                            key={`${index}-${letter}`}
                            type="button"
                            disabled={revealed}
                            onClick={() => handlePick(i)}
                            initial={false}
                            animate={
                              revealed && i === item.correctIndex
                                ? { scale: [1, 1.02, 1] }
                                : {}
                            }
                            transition={{ duration: 0.35 }}
                            className={`flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left text-sm leading-snug text-white/95 transition-colors disabled:cursor-default sm:text-base ${optionClass(i)}`}
                          >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/30 font-bold text-pink-300">
                              {letter}
                            </span>
                            <span className="pt-0.5">{text}</span>
                          </motion.button>
                        );
                      })}
                    </div>

                    <AnimatePresence>
                      {revealed && (
                        <motion.div
                          key="feedback"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                          className="mt-6 space-y-4"
                        >
                          <div
                            className={`rounded-2xl border px-4 py-3 text-center text-sm sm:text-base ${pickedIndex === item.correctIndex
                                ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100'
                                : 'border-amber-400/35 bg-amber-500/10 text-amber-100'
                              }`}
                          >
                            {pickedIndex === item.correctIndex ? (
                              <span className="font-semibold">✓ Acertou!</span>
                            ) : (
                              <span className="font-semibold">Quase! A certa é a {LETTERS[item.correctIndex]}.</span>
                            )}
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-center">
                            <p className="text-xs font-medium uppercase tracking-wider text-cyan-300/90">
                              Resposta
                            </p>
                            <p className="mt-2 text-base font-semibold leading-relaxed text-white sm:text-lg">
                              {item.answerSummary}
                            </p>
                          </div>

                          <p className="pb-1 text-center text-xs text-white/45">
                            {isLast
                              ? 'Mensagem final em 2 segundos…'
                              : 'Próxima questão em 2 segundos…'}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {stage === 'final' && (
                  <motion.div
                    key="final-screen"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="pt-2 text-center"
                  >
                    <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
                      Para você
                    </p>
                    <div className="space-y-5 text-base leading-relaxed text-white/95 sm:text-lg">
                      {FINAL_LINES.map((line, i) => (
                        <motion.p
                          key={line}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.15 + i * 0.2, duration: 0.45 }}
                          className={i === FINAL_LINES.length - 1 ? 'font-bold text-pink-200' : ''}
                        >
                          {line}
                        </motion.p>
                      ))}
                    </div>
                    <motion.button
                      type="button"
                      onClick={onClose}
                      className="mt-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-10 py-3 font-semibold text-white"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Fechar
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
