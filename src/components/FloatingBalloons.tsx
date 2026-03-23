import { motion } from 'framer-motion';

const balloons = [
  { color: '#ff5ea8', delay: 0, x: '10%' },
  { color: '#7c5cff', delay: 0.5, x: '25%' },
  { color: '#00d4ff', delay: 1, x: '40%' },
  { color: '#ffd700', delay: 1.5, x: '60%' },
  { color: '#ff8c42', delay: 2, x: '75%' },
  { color: '#ff5ea8', delay: 2.5, x: '90%' },
  { color: '#7c5cff', delay: 3, x: '5%' },
  { color: '#00d4ff', delay: 3.5, x: '95%' },
];

export function FloatingBalloons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {balloons.map((balloon, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: balloon.x }}
          initial={{ y: '110vh', rotate: 0 }}
          animate={{
            y: '-20vh',
            rotate: [0, 10, -10, 5, -5, 0],
            x: [0, 20, -20, 10, -10, 0]
          }}
          transition={{
            y: {
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: balloon.delay,
              ease: 'linear'
            },
            rotate: {
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut'
            },
            x: {
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }
          }}
        >
          <div
            className="w-12 h-16 rounded-full opacity-60"
            style={{
              background: `radial-gradient(circle at 30% 30%, ${balloon.color}, ${balloon.color}88)`,
              boxShadow: `0 0 20px ${balloon.color}50`,
            }}
          >
            {/* Reflexo */}
            <div 
              className="absolute top-2 left-2 w-3 h-4 rounded-full opacity-50"
              style={{ background: 'rgba(255,255,255,0.6)' }}
            />
          </div>
          {/* Corda */}
          <div 
            className="absolute top-16 left-1/2 w-px h-20 -translate-x-1/2"
            style={{ 
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)',
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
