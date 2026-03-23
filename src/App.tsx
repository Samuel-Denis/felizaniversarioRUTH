import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Moon, Zap, Heart, Utensils,
  Footprints, Wind, Eye, Users, BookOpen, Laugh,
  CalendarDays
} from 'lucide-react';

import { ParticleBackground } from './components/ParticleBackground';
import { StarField } from './components/StarField';
import { FloatingBalloons } from './components/FloatingBalloons';
import { IntroAnimation } from './components/IntroAnimation';
import { StoryViewer } from './components/StoryViewer';
import { FinalCelebration } from './components/FinalCelebration';
import { getAgeOnDate, getDaysLived, RUTH_BIRTH, RUTH_CELEBRATION } from './lib/birthdate';

// Tipo para os stories
interface Story {
  cat: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  color: string;
}

interface Stats {
  totalDays: number;
  totalWeeks: number;
  totalMonths: number;
  totalMinutes: number;
  heartBeats: number;
  fmt: (n: number) => string;
}

function getStats(): Stats {
  const totalDays = getDaysLived(RUTH_BIRTH, RUTH_CELEBRATION);
  const diffMs = Math.abs(RUTH_CELEBRATION.getTime() - RUTH_BIRTH.getTime());
  const totalWeeks = Math.floor(totalDays / 7);
  const totalMonths = Math.floor(totalDays / 30.4375);
  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const heartBeats = (totalMinutes * 75) / 1000000000;
  const fmt = (n: number) => n.toLocaleString('pt-BR');

  return { totalDays, totalWeeks, totalMonths, totalMinutes, heartBeats, fmt };
}

// Dados dos cards
const createStories = (stats: Stats): Story[] => {
  const { totalDays, totalWeeks, totalMonths, heartBeats, fmt } = stats;
  return [
    {
      cat: 'DIAS',
      title: `${fmt(totalDays)} Dias`,
      desc: `Ruth, são ${fmt(totalDays)} dias. Dez mil chances de recomeçar, de errar, de acertar e de ser você. Se cada dia fosse uma página, você já teria escrito uma biblioteca inteira de coragem e vida. Não são apenas datas no calendário, são ${fmt(totalDays)} vitórias silenciosas que te trouxeram até aqui.`,
      icon: <CalendarDays className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#7c5cff'
    },
    {
      cat: 'SEMANAS',
      title: `${fmt(totalWeeks)} Semanas`,
      desc: `Foram mais de ${fmt(totalWeeks)} semanas. Pense em quantas 'segundas-feiras' você venceu e quantos 'sextou' você comemorou. Foram ciclos de sete dias que se repetiram, cada um com um desafio diferente, mas todos superados com a sua essência única.`,
      icon: <Sparkles className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#7c5cff'
    },
    {
      cat: 'MESES',
      title: `${fmt(totalMonths)} Meses`,
      desc: `Cerca de ${fmt(totalMonths)} meses vendo a lua mudar de fase. Você viveu todas as estações: o calor dos verões e o florescer das primaveras. Em cada mês, uma Ruth diferente se reinventou.`,
      icon: <Moon className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#00d4ff'
    },
    {
      cat: 'EQUILÍBRIO',
      title: 'Sonhos e Despertares',
      desc: `Foram ${fmt(totalDays)} manhãs abrindo os olhos e ${fmt(totalDays)} noites entregando seus planos ao descanso. Um equilíbrio entre o esforço de estar acordada e a magia de nunca parar de sonhar.`,
      icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#ffd700'
    },
    {
      cat: 'BATIDAS',
      title: 'Coração',
      desc: `Seu coração bateu mais de ${heartBeats.toFixed(1)} bilhão de vezes. Ele acelerou de alegria e palpitou de amor. É um motor incansável que acompanha cada ritmo da sua música favorita.`,
      icon: <Heart className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#ff5ea8'
    },
    {
      cat: 'SABORES',
      title: 'Refeições',
      desc: `Você sentou à mesa pelo menos ${fmt(totalDays * 3)} vezes! Cada brinde nesses ${fmt(totalDays)} dias foi o combustível para você chegar até aqui com esse gosto pela vida.`,
      icon: <Utensils className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#ff8c42'
    },
    {
      cat: 'CAMINHADA',
      title: 'Passos',
      desc: `Seus pés percorreram milhares de quilômetros. Foram passos firmes em direção aos seus objetivos. O chão que você pisou nunca mais foi o mesmo depois da sua presença.`,
      icon: <Footprints className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#7c5cff'
    },
    {
      cat: 'RESPIRAÇÃO',
      title: 'Suspiros',
      desc: `Foram milhões de vezes inspirando o ar. Celebramos hoje todos os suspiros de alívio e aquele ar que falta quando a gente ri até a barriga doer.`,
      icon: <Wind className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#00d4ff'
    },
    {
      cat: 'VISÃO',
      title: 'Olhares',
      desc: `Quantas cores e paisagens passaram pelas suas pupilas? Seus olhos foram as janelas de uma alma que soube observar a beleza onde ninguém mais via.`,
      icon: <Eye className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#ffd700'
    },
    {
      cat: 'CONEXÕES',
      title: 'Amizades',
      desc: `Nesses ${fmt(totalDays)} dias, muita gente passou por você. Cada aperto de mão e cada conversa transformaram a sua jornada em algo compartilhado.`,
      icon: <Users className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#ff5ea8'
    },
    {
      cat: 'SABEDORIA',
      title: 'Aprendizados',
      desc: `A vida não veio com manual, mas você aprendeu a ler as entrelinhas. Seu maior diploma não é de papel, é a sabedoria que brilha no seu olhar.`,
      icon: <BookOpen className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#7c5cff'
    },
    {
      cat: 'HUMOR',
      title: 'Pausas Técnicas',
      desc: `E, para as estatísticas reais... você deve ter visitado o 'trono' umas ${fmt(totalDays * 6)} vezes! Pausas essenciais para manter o sistema rodando. Até nisso você é eficiente!`,
      icon: <Laugh className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#00d4ff'
    },
    {
      cat: 'OFF-SCRIPT',
      title: 'Alucinações',
      desc: `Nem tudo foram flores. Teve dia que a cabeça viajou no cansaço, mas cada 'bug' no sistema mostrou que sua realidade é mais interessante que qualquer ficção!`,
      icon: <Zap className="w-8 h-8 sm:w-10 sm:h-10" />,
      color: '#ff8c42'
    },
  ];
};

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showStories, setShowStories] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const stats = useMemo(() => getStats(), []);
  const stories = useMemo(() => createStories(stats), [stats]);
  const ageYears = useMemo(() => getAgeOnDate(RUTH_BIRTH, RUTH_CELEBRATION), []);
  const currentStory = stories[currentStoryIndex] ?? stories[0];

  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
    setShowStories(false);
    setShowFinal(true);
  }, []);

  const handleStoryComplete = useCallback(() => {
    setShowStories(false);
    setShowFinal(true);
  }, []);

  const handleStoryView = useCallback((index: number) => {
    setCurrentStoryIndex(index);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#050505' }}>
      {/* Fundos animados */}
      <StarField />
      <ParticleBackground />
      <FloatingBalloons />

      {/* Gradiente de fundo */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, #1a0b2e 0%, transparent 50%)',
        }}
      />

      {/* Conteúdo */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <IntroAnimation key="intro" onComplete={handleIntroComplete} />
        )}

        {!showIntro && showStories && !showFinal && (
          <motion.div
            key="stories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20"
          >
            {/* Fundo dinâmico da seção */}
            <motion.div
              key={`story-bg-${currentStoryIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 20%, ${currentStory.color}33 0%, transparent 55%)`,
              }}
            />

            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <span className="text-pink-400 text-sm tracking-[0.3em] uppercase mb-4 block">
                Uma jornada incrível
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white">
                Os <span className="gradient-text">{stats.fmt(stats.totalDays)} Dias</span> de Ruth
              </h1>
            </motion.div>

            {/* Story Viewer */}
            <StoryViewer
              stories={stories}
              onComplete={handleStoryComplete}
              onStoryView={handleStoryView}
            />

          </motion.div>
        )}

        {showFinal && (
          <FinalCelebration key="final" totalDays={stats.totalDays} ageYears={ageYears} />
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
