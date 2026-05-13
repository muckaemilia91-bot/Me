import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Plus, 
  Calendar, 
  TrendingUp, 
  LogOut, 
  MessageSquare,
  Smile,
  Meh,
  Frown,
  Heart,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { subscribeToEntries, addEntry } from '../lib/moodlService';
import { generateDailyChallenge, getMoodInsight } from '../lib/geminiService';
import EntryEditor from './EntryEditor';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [entries, setEntries] = useState<any[]>([]);
  const [challenge, setChallenge] = useState<any>(null);
  const [insight, setInsight] = useState<string>('');
  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToEntries(user.uid, (data) => {
      setEntries(data);
      if (data.length > 0) {
        setLoadingInsight(true);
        getMoodInsight(data[0].content).then(res => {
          setInsight(res);
          setLoadingInsight(false);
        });
      }
    });

    // Load daily challenge
    const loadChallenge = async () => {
      const c = await generateDailyChallenge();
      setChallenge(c);
      setLoadingChallenge(false);
    };
    loadChallenge();
    
    return () => unsubscribe();
  }, [user.uid]);

  const handleSaveEntry = async (entry: { mood: string; content: string }) => {
    const today = new Date().toISOString().split('T')[0];
    await addEntry(user.uid, {
      ...entry,
      date: today,
      challengeId: challenge?.title
    });
    setIsAddingEntry(false);
  };

  const todayEntry = entries.find(e => e.date === new Date().toISOString().split('T')[0]);

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-10 min-h-screen bg-[#FFF9F5]">
      {/* Header */}
      <header className="flex items-center justify-between mb-16">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#FF6B35] rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-display font-black tracking-tighter text-[#1A1A1A]">moodly.</h2>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="bg-white px-5 py-2.5 rounded-full shadow-sm flex items-center gap-2 border border-[#FFEDE1]">
            <span className="text-[#FF6B35] font-black text-sm uppercase tracking-wide">🔥 0 Ditë Radhazi</span>
          </div>
          <button 
            onClick={onLogout}
            className="p-3 bg-white rounded-2xl shadow-sm border border-[#FFEDE1] text-[#1A1A1A] hover:bg-[#FF6B35] hover:text-white transition-all transform hover:-rotate-6"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Main Content */}
        <div className="lg:col-span-8 space-y-10">
          {/* Welcome & Challenge Section */}
          <section className="bg-[#FFD166] rounded-[48px] p-10 shadow-xl shadow-[#FFD166]/20 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="bg-white/90 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-[#1A1A1A]">Sfida Ditore</span>
              <h3 className="text-4xl font-display font-black mt-6 mb-3 text-[#1A1A1A] leading-tight">
                Përshëndetje, {user.displayName?.split(' ')[0]}!
              </h3>
              <p className="text-[#1A1A1A]/70 mb-10 font-medium text-lg">Gati për ta bërë tregimin e sotëm të shndritshëm?</p>
              
              <div className="bg-white/40 backdrop-blur-md rounded-[32px] p-8 border border-white/40">
                {loadingChallenge ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-6 bg-white/50 rounded-lg w-1/3"></div>
                    <div className="h-4 bg-white/50 rounded-lg w-full"></div>
                    <div className="h-4 bg-white/50 rounded-lg w-2/3"></div>
                  </div>
                ) : (
                  <>
                    <h4 className="text-2xl font-display font-black text-[#1A1A1A] mb-3 leading-tight">{challenge?.title}</h4>
                    <p className="text-[#1A1A1A]/80 font-medium leading-relaxed text-lg">{challenge?.description}</p>
                  </>
                )}
              </div>
            </div>
            
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#FF6B35]/20 rounded-full blur-2xl pointer-events-none" />
          </section>

          {/* Today's Action */}
          {!todayEntry ? (
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsAddingEntry(true)}
              className="w-full py-10 bg-[#1A1A1A] text-white rounded-[40px] flex items-center justify-between px-10 shadow-2xl shadow-[#1A1A1A]/30 group"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#FF6B35] rounded-3xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <Plus className="w-8 h-8 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="text-3xl font-display font-black tracking-tight">Kap çastin</h4>
                  <p className="text-white/50 font-medium">Duhet vetëm një minutë për të reflektuar</p>
                </div>
              </div>
              <ChevronRight className="w-10 h-10 text-[#FF6B35] group-hover:translate-x-2 transition-transform" />
            </motion.button>
          ) : (
            <div className="bg-white border-4 border-[#FF6B35] rounded-[48px] p-10 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-[#FFEDE1] rounded-3xl flex items-center justify-center">
                  <Heart className="w-8 h-8 text-[#FF6B35]" />
                </div>
                <div className="text-left">
                  <h4 className="text-2xl font-display font-black text-[#1A1A1A]">Reflektimi u Krye!</h4>
                  <p className="text-[#1A1A1A]/50 font-medium italic">Mendimet tuaja janë të sigurta në arkivin tuaj.</p>
                </div>
              </div>
              <span className="text-4xl">✨</span>
            </div>
          )}

          {/* History */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-2xl font-display font-black text-[#1A1A1A]">Ndjesitë e kaluara</h3>
              <button className="text-sm font-black uppercase tracking-widest text-[#FF6B35]">Shiko të gjitha</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {entries.slice(0, 4).map((entry, idx) => {
                const colors = ['bg-[#A5A6F6]', 'bg-[#FF88BB]', 'bg-[#6BDBFF]', 'bg-[#FFEDE1]'];
                const textColor = idx === 3 ? 'text-[#1A1A1A]' : 'text-white';
                const rotate = idx % 2 === 0 ? '-rotate-1' : 'rotate-1';
                
                return (
                  <motion.div 
                    key={entry.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`${colors[idx % colors.length]} p-8 rounded-[40px] shadow-lg flex flex-col gap-4 transform ${rotate} hover:rotate-0 transition-transform cursor-pointer`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                        {entry.mood === 'great' && '🤩'}
                        {entry.mood === 'good' && '😊'}
                        {entry.mood === 'neutral' && '😐'}
                        {entry.mood === 'sad' && '😔'}
                        {entry.mood === 'awful' && '🖤'}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${idx === 3 ? 'bg-[#1A1A1A]/5' : 'bg-white/20'} ${textColor}`}>
                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className={`font-medium italic leading-relaxed line-clamp-3 text-lg ${textColor}`}>
                      "{entry.content}"
                    </p>
                  </motion.div>
                );
              })}
              {entries.length === 0 && (
                <div className="col-span-full bg-white border-4 border-dashed border-[#FFEDE1] rounded-[40px] py-20 text-center flex flex-col items-center gap-4">
                  <div className="w-20 h-20 bg-[#FFF9F5] rounded-full flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-[#FFEDE1]" />
                  </div>
                  <p className="font-display font-black text-2xl text-[#FFEDE1] uppercase tracking-tighter">Arkivi juaj është bosh</p>
                  <button onClick={() => setIsAddingEntry(true)} className="px-6 py-2 bg-[#FF6B35] text-white rounded-full font-black text-sm uppercase tracking-widest shadow-lg">Fillo Udhëtimin</button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Sidebar: Mood Insights */}
        <div className="lg:col-span-4 space-y-10">
           <section className="bg-white rounded-[48px] p-10 shadow-2xl border border-[#FFEDE1] relative overflow-hidden">
            <div className="w-16 h-16 bg-[#FF6B35]/10 rounded-3xl flex items-center justify-center mb-8">
              <MessageSquare className="w-8 h-8 text-[#FF6B35]" />
            </div>
            <h3 className="text-3xl font-display font-black text-[#1A1A1A] mb-6 leading-tight">Analiza nga AI</h3>
            <div className="space-y-6 relative z-10">
              {loadingInsight ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-100 rounded-full w-full"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded-full w-2/3"></div>
                </div>
              ) : insight ? (
                <p className="text-[#2D2D2D] font-medium italic text-xl leading-relaxed">
                  "{insight}"
                </p>
              ) : entries.length > 0 ? (
                <p className="text-[#2D2D2D] font-medium italic text-xl leading-relaxed">
                  "Reflektimi juaj i vazhdueshëm është një mjet i fuqishëm për rritje. Vazhdoni të ushqeni botën tuaj të brendshme."
                </p>
              ) : (
                <p className="text-gray-400 font-medium italic text-lg leading-relaxed">
                  Filloni të shkruani për të marrë analiza të fuqizuara nga AI mbi humorin dhe udhëtimin tuaj të rritjes.
                </p>
              )}
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#FFEDE1] rounded-full blur-2xl opacity-50" />
          </section>

          <section className="bg-white rounded-[48px] p-10 shadow-xl border border-[#FFEDE1]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-[#FFEDE1] rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <h3 className="text-2xl font-display font-black text-[#1A1A1A]">Ngjit shkallët</h3>
            </div>
            <div className="space-y-4">
              <div className="p-6 bg-[#A5A6F6]/10 rounded-[32px] border border-[#A5A6F6]/20 group hover:bg-[#A5A6F6]/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-[#A5A6F6]">01</div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-[#A5A6F6]">Arritur</span>
                    <span className="font-bold text-[#1A1A1A]">Reflektimi i Parë</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 opacity-50 relative overflow-hidden">
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center font-black text-gray-300">07</div>
                  <div>
                    <span className="block text-xs font-black uppercase tracking-widest text-gray-400">Kyçur</span>
                    <span className="font-bold text-gray-400">I Dituri 7-Ditor</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <AnimatePresence>
        {isAddingEntry && (
          <EntryEditor 
            onClose={() => setIsAddingEntry(false)} 
            onSave={handleSaveEntry}
            challenge={challenge}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
