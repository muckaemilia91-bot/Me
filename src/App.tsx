/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, signInWithGoogle } from './lib/firebase';
import { syncUser } from './lib/moodlService';
import { LogIn, Sparkles, BookOpen, Calendar as CalendarIcon, User as UserIcon, LogOut, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import Landing from './components/Landing';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        await syncUser(u);
        setUser(u);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF9F5]">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-[#FF6B35] flex flex-col items-center gap-4"
        >
          <Sparkles className="w-12 h-12" />
          <p className="font-display font-black text-2xl uppercase tracking-tighter">moodly.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#1A1A1A] font-sans">
      <AnimatePresence mode="wait">
        {!user ? (
          <Landing onLogin={signInWithGoogle} />
        ) : (
          <Dashboard user={user} onLogout={() => auth.signOut()} />
        )}
      </AnimatePresence>
    </div>
  );
}

