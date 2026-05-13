import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sparkles, Send } from 'lucide-react';

interface EntryEditorProps {
  onClose: () => void;
  onSave: (entry: { mood: string; content: string }) => void;
  challenge?: any;
}

const moods = [
  { id: 'awful', label: 'Dobët', emoji: '😔', color: 'bg-[#FEE2E2] text-red-600', activeBg: 'bg-red-500' },
  { id: 'neutral', label: 'Ashtu-ashtu', emoji: '😐', color: 'bg-[#FEF3C7] text-amber-600', activeBg: 'bg-amber-500' },
  { id: 'good', label: 'Mirë', emoji: '😊', color: 'bg-[#D1FAE5] text-[#10B981]', activeBg: 'bg-[#10B981]' },
  { id: 'great', label: 'Shkëlqyeshëm', emoji: '🤩', color: 'bg-[#DBEAFE] text-blue-600', activeBg: 'bg-blue-500' },
];

export default function EntryEditor({ onClose, onSave, challenge }: EntryEditorProps) {
  const [selectedMood, setSelectedMood] = useState('good');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    setIsSubmitting(true);
    await onSave({ mood: selectedMood, content });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#1A1A1A]/40 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="relative bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden border border-[#FFEDE1]"
      >
        <div className="p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-4xl font-display font-black text-[#1A1A1A] tracking-tighter">I dashur ditar...</h3>
            <button onClick={onClose} className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors">
              <X className="w-6 h-6 text-[#1A1A1A]" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Mood Selector */}
            <div className="space-y-4">
              <label className="text-xs uppercase tracking-[0.2em] font-black text-[#FF6B35]">Si po ndihesh?</label>
              <div className="flex justify-between gap-4">
                {moods.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setSelectedMood(m.id)}
                    className={`flex-1 p-4 rounded-3xl flex flex-col items-center gap-3 transition-all transform 
                      ${selectedMood === m.id 
                        ? `${m.activeBg} text-white scale-110 shadow-xl border-transparent` 
                        : `${m.color} bg-opacity-40 border-transparent hover:scale-105`
                      } border-2`}
                  >
                    <span className="text-3xl">{m.emoji}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${selectedMood === m.id ? 'text-white' : ''}`}>{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Challenge Context */}
            {challenge && (
              <div className="bg-[#FFD166] p-6 rounded-[32px] shadow-inner relative overflow-hidden group">
                <div className="relative z-10 flex items-start gap-4">
                  <div className="mt-1 p-2 bg-white rounded-xl text-[#FF6B35] shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1A1A1A] uppercase tracking-[0.2em] mb-1">Reflektimi i sfidës</h4>
                    <p className="text-[#1A1A1A] text-lg font-bold leading-tight">
                      {challenge.title}: {challenge.description}
                    </p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm pointer-events-none group-hover:scale-110 transition-transform">
                  <Sparkles className="w-20 h-20" />
                </div>
              </div>
            )}

            {/* Content Area */}
            <div className="relative group">
              <textarea
                autoFocus
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Fillo të shkruash tregimin tënd..."
                className="w-full min-h-[200px] bg-[#FFF9F5] rounded-[32px] border-2 border-transparent p-8 focus:border-[#FF6B35] focus:ring-0 placeholder-[#1A1A1A]/20 text-2xl font-medium italic text-[#1A1A1A] leading-relaxed resize-none shadow-inner transition-all"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="inline-flex items-center gap-4 px-12 py-6 bg-[#FF6B35] text-white rounded-[24px] text-xl font-black shadow-xl shadow-[#FF6B35]/30 hover:scale-105 transition-all disabled:opacity-50 disabled:shadow-none active:scale-95"
              >
                {isSubmitting ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    ✨
                  </motion.div>
                ) : (
                  <Send className="w-6 h-6" />
                )}
                Ruaj ndjesinë
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
