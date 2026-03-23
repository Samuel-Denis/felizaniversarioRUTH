import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_TARGET_AGE = 28;
const GRAVITY = 0.65;
const JUMP_VELOCITY = -13;
const GAME_SPEED = 5.5;
const PLAYER_W = 52;
const PLAYER_H = 52;
const GROUND_PAD = 36;
const PLAYER_X = 72;

const BALLOON_BG = [
  { color: '#ff5ea8', delay: 0, x: '10%' },
  { color: '#7c5cff', delay: 0.5, x: '28%' },
  { color: '#00d4ff', delay: 1, x: '46%' },
  { color: '#ffd700', delay: 1.5, x: '64%' },
  { color: '#ff8c42', delay: 2, x: '82%' },
  { color: '#ff5ea8', delay: 2.5, x: '5%' },
  { color: '#7c5cff', delay: 3, x: '95%' },
];

interface Obstacle {
  x: number;
  w: number;
  h: number;
  scored: boolean;
}

interface AgeRunnerGameProps {
  open: boolean;
  onClose: () => void;
  avatarSrc: string;
  /** Idade a atingir (ex.: 28 anos) */
  targetAge?: number;
}

export function AgeRunnerGame({
  open,
  onClose,
  avatarSrc,
  targetAge = DEFAULT_TARGET_AGE,
}: AgeRunnerGameProps) {
  const goal = Math.max(2, Math.min(99, Math.round(targetAge)));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const phaseRef = useRef<'loading' | 'ready' | 'playing' | 'won' | 'lost'>('loading');

  const [phase, setPhase] = useState<'loading' | 'ready' | 'playing' | 'won' | 'lost'>('loading');
  const [displayAge, setDisplayAge] = useState(1);

  const gameRef = useRef({
    playerY: 0,
    vy: 0,
    obstacles: [] as Obstacle[],
    nextGap: 260,
    running: false,
    age: 1,
  });

  const resetGame = useCallback(() => {
    gameRef.current = {
      playerY: 0,
      vy: 0,
      obstacles: [],
      nextGap: 260,
      running: false,
      age: 1,
    };
    setDisplayAge(1);
    setPhase('loading');
    phaseRef.current = 'loading';
  }, []);

  useEffect(() => {
    if (!open) {
      resetGame();
      return;
    }
    const img = new Image();
    img.src = avatarSrc;
    img.onload = () => {
      imgRef.current = img;
      setPhase('ready');
      phaseRef.current = 'ready';
    };
    img.onerror = () => {
      setPhase('ready');
      phaseRef.current = 'ready';
    };
  }, [open, avatarSrc, resetGame]);

  const startPlaying = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const w = Math.max(wrap.clientWidth, 320);
    const h = 280;
    canvas.width = w;
    canvas.height = h;

    const groundY = h - GROUND_PAD;
    gameRef.current.playerY = groundY - PLAYER_H;
    gameRef.current.vy = 0;
    gameRef.current.obstacles = [];
    gameRef.current.nextGap = 220 + Math.random() * 100;
    gameRef.current.age = 1;
    gameRef.current.running = true;
    setDisplayAge(1);
    setPhase('playing');
    phaseRef.current = 'playing';
  }, []);

  const jump = useCallback(() => {
    if (phaseRef.current !== 'playing' || !gameRef.current.running) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const groundY = canvas.height - GROUND_PAD;
    const g = gameRef.current;
    if (g.playerY >= groundY - PLAYER_H - 2) {
      g.vy = JUMP_VELOCITY;
    }
  }, []);

  useEffect(() => {
    if (phase !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = imgRef.current;

    const spawnObstacle = (cw: number) => {
      const hObs = 36 + Math.random() * 24;
      const wObs = 24 + Math.random() * 12;
      gameRef.current.obstacles.push({
        x: cw + 30,
        w: wObs,
        h: hObs,
        scored: false,
      });
      gameRef.current.nextGap = 200 + Math.random() * 160;
    };

    const loop = () => {
      if (!gameRef.current.running || phaseRef.current !== 'playing') return;

      const cw = canvas.width;
      const ch = canvas.height;
      const groundY = ch - GROUND_PAD;
      const g = gameRef.current;

      g.vy += GRAVITY;
      g.playerY += g.vy;
      if (g.playerY >= groundY - PLAYER_H) {
        g.playerY = groundY - PLAYER_H;
        g.vy = 0;
      }

      for (const o of g.obstacles) {
        o.x -= GAME_SPEED;
      }
      g.obstacles = g.obstacles.filter((o) => o.x + o.w > -40);

      const last = g.obstacles[g.obstacles.length - 1];
      if (g.obstacles.length === 0) {
        spawnObstacle(cw);
      } else if (last && last.x < cw - g.nextGap) {
        spawnObstacle(cw);
      }

      const hitBox = {
        x: PLAYER_X + 8,
        y: g.playerY + 8,
        w: PLAYER_W - 16,
        h: PLAYER_H - 10,
      };

      for (const o of g.obstacles) {
        const ox = o.x;
        const oy = groundY - o.h;
        if (
          hitBox.x < ox + o.w - 4 &&
          hitBox.x + hitBox.w > ox + 4 &&
          hitBox.y < oy + o.h &&
          hitBox.y + hitBox.h > oy + 6
        ) {
          g.running = false;
          phaseRef.current = 'lost';
          setPhase('lost');
          return;
        }
      }

      for (const o of g.obstacles) {
        if (!o.scored && o.x + o.w < PLAYER_X) {
          o.scored = true;
          g.age += 1;
          setDisplayAge(g.age);
          if (g.age >= goal) {
            g.running = false;
            phaseRef.current = 'won';
            setPhase('won');
            confetti({
              particleCount: 120,
              spread: 80,
              origin: { y: 0.55 },
              colors: ['#ff5ea8', '#7c5cff', '#00d4ff', '#ffd700'],
            });
            return;
          }
        }
      }

      ctx.clearRect(0, 0, cw, ch);

      ctx.fillStyle = 'rgba(255,255,255,0.06)';
      ctx.fillRect(0, groundY, cw, ch - groundY);

      ctx.strokeStyle = 'rgba(255,94,168,0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 0.5);
      ctx.lineTo(cw, groundY + 0.5);
      ctx.stroke();

      for (const o of g.obstacles) {
        const oy = groundY - o.h;
        const grd = ctx.createLinearGradient(o.x, oy, o.x + o.w, oy + o.h);
        grd.addColorStop(0, '#2d1f3d');
        grd.addColorStop(1, '#1a1025');
        ctx.fillStyle = grd;
        ctx.fillRect(o.x, oy, o.w, o.h);
        ctx.strokeStyle = 'rgba(255,94,168,0.4)';
        ctx.strokeRect(o.x, oy, o.w, o.h);
      }

      if (img && img.complete && img.naturalWidth) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(
          PLAYER_X + PLAYER_W / 2,
          g.playerY + PLAYER_H / 2,
          PLAYER_W / 2 - 2,
          0,
          Math.PI * 2
        );
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, PLAYER_X, g.playerY, PLAYER_W, PLAYER_H);
        ctx.restore();
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          PLAYER_X + PLAYER_W / 2,
          g.playerY + PLAYER_H / 2,
          PLAYER_W / 2 - 1,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      } else {
        ctx.fillStyle = '#ff5ea8';
        ctx.fillRect(PLAYER_X, g.playerY, PLAYER_W, PLAYER_H);
      }

      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.font = 'bold 17px system-ui, sans-serif';
      ctx.fillText(`Idade: ${g.age} / ${goal}`, 14, 26);

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      gameRef.current.running = false;
    };
  }, [phase, goal]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (phase === 'ready' || phase === 'lost') startPlaying();
        else jump();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, phase, jump, startPlaying]);

  useEffect(() => {
    if (!open || !wrapRef.current) return;
    const ro = new ResizeObserver(() => {
      const canvas = canvasRef.current;
      const wrap = wrapRef.current;
      if (!canvas || !wrap || phaseRef.current !== 'playing') return;
      canvas.width = Math.max(wrap.clientWidth, 320);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [open]);

  const handleClose = () => {
    gameRef.current.running = false;
    phaseRef.current = 'loading';
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="age-runner"
          className="fixed inset-0 z-[100]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div
            role="presentation"
            className="absolute inset-0 bg-[#0d0618]/92 backdrop-blur-md"
            onClick={handleClose}
          />

          <div className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mini jogo: corrida até os 28 anos"
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ type: 'spring', damping: 24, stiffness: 280 }}
              className="pointer-events-auto relative flex w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#12081f]/95 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
                {BALLOON_BG.map((b, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{ left: b.x, top: `${8 + (i % 3) * 12}%` }}
                    animate={{ y: [0, -12, 0], rotate: [0, 6, -6, 0] }}
                    transition={{
                      duration: 4 + (i % 3),
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: b.delay * 0.3,
                    }}
                  >
                    <div
                      className="h-14 w-11 rounded-full opacity-70"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${b.color}, ${b.color}88)`,
                        boxShadow: `0 0 16px ${b.color}40`,
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="absolute right-3 top-3 z-20 rounded-full bg-black/40 p-2 text-white/80 hover:bg-black/60 hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="relative z-10 p-4 sm:p-6">
                <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-pink-400">
                  Corrida do aniversário
                </p>
                <h2 className="mt-1 text-center text-lg font-bold text-white sm:text-xl">
                  Pula os obstáculos até a idade {goal}!
                </h2>
                <p className="mt-2 text-center text-xs text-white/55 sm:text-sm">
                  Espaço ou toque na pista para pular — estilo dinossauro do Chrome.
                </p>

                <div
                  ref={wrapRef}
                  className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black/35"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    if (phase === 'ready' || phase === 'lost') startPlaying();
                    else jump();
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="block h-[280px] w-full cursor-pointer touch-none select-none"
                    style={{ touchAction: 'none' }}
                  />

                  {(phase === 'loading' || phase === 'ready') && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 backdrop-blur-[2px]">
                      <p className="mb-3 text-center text-sm text-white/90">
                        {phase === 'loading' ? 'A carregar…' : 'Pronta?'}
                      </p>
                      {phase === 'ready' && (
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            startPlaying();
                          }}
                          className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 font-semibold text-white shadow-lg"
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          Começar
                        </motion.button>
                      )}
                    </div>
                  )}

                  {phase === 'lost' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
                      <p className="mb-1 text-lg font-bold text-white">Ops!</p>
                      <p className="mb-4 max-w-xs text-center text-sm text-white/80">
                        Bateu no obstáculo. A Ruth ainda tem muitos anos pela frente — tenta outra vez!
                      </p>
                      <motion.button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startPlaying();
                        }}
                        className="rounded-full border border-white/30 bg-white/15 px-6 py-2.5 font-semibold text-white"
                        whileHover={{ scale: 1.03 }}
                      >
                        Tentar de novo
                      </motion.button>
                    </div>
                  )}

                  {phase === 'won' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0b2e]/95 to-black/90 px-4 backdrop-blur-sm">
                      <motion.div
                        initial={{ scale: 0.85, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', damping: 14 }}
                        className="max-w-sm text-center"
                      >
                        <p className="bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 bg-clip-text text-2xl font-black text-transparent sm:text-3xl">
                          Você chegou aos {goal}! 🎉
                        </p>
                        <p className="mt-4 text-lg font-semibold text-white">
                          Feliz aniversário, Ruth ❤️
                        </p>
                        <p className="mt-3 text-sm leading-relaxed text-white/75">
                          Cada pulo foi um ano a mais na corrida — e você atravessou todos até a linha de chegada.
                        </p>
                        <motion.button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClose();
                          }}
                          className="mt-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-10 py-3 font-semibold text-white shadow-lg"
                          whileHover={{ scale: 1.03 }}
                        >
                          Maravilhoso!
                        </motion.button>
                      </motion.div>
                    </div>
                  )}
                </div>

                {phase === 'playing' && (
                  <p className="mt-3 text-center text-[11px] text-white/40">
                    Idade atual: {displayAge} — Dica: espaço ou toque para saltar.
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
