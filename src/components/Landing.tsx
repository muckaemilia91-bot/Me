import { motion } from 'motion/react';
import { LogIn, Sparkles, Heart } from 'lucide-react';

interface LandingProps {
  onLogin: () => void;
}

export default function Landing({ onLogin }: LandingProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#FFF9F5]"
    >
      <div className="max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="flex justify-center mb-10"
        >
          <div className="w-20 h-20 bg-[#FF6B35] rounded-3xl flex items-center justify-center text-white shadow-2xl">
            <Sparkles className="w-10 h-10" />
          </div>
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-7xl md:text-9xl font-display font-black mb-6 text-[#1A1A1A] tracking-tighter"
        >
          moodly.
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xl md:text-2xl font-medium text-[#2D2D2D] mb-12 leading-tight max-w-lg mx-auto"
        >
          Shpërthimi juaj ditor i <span className="text-[#FF6B35] font-bold italic">ndërgjegjësimit</span> dhe <span className="text-[#A5A6F6] font-bold italic">rritjes</span> krijuese.
        </motion.p>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={onLogin}
          className="inline-flex items-center gap-4 px-10 py-5 bg-[#FF6B35] text-white rounded-[24px] text-xl font-black hover:scale-105 transition-all shadow-[0_10px_30px_-10px_rgba(255,107,53,0.5)] active:scale-95"
        >
          <LogIn className="w-6 h-6" />
          Hyr tani
        </motion.button>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-24 flex items-center justify-center gap-12"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-[#FFD166] rounded-3xl shadow-lg flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">I vetëdijshëm</span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="w-16 h-16 bg-[#A5A6F6] rounded-3xl shadow-lg flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-[#1A1A1A]">I frymëzuar</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
