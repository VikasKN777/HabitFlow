import React, { useState } from 'react';
import { Plus, X, Sparkles, Target, Zap, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit } from '../types';
import { suggestHabits } from '../services/aiService';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: Omit<Habit, 'id' | 'createdAt'>) => void;
}

const CATEGORIES = ['Health', 'Work', 'Mind', 'General', 'Social'];
const SUGGESTIONS = [
  { name: 'Morning Meditation', icon: '🧘' },
  { name: 'Read 20 pages', icon: '📚' },
  { name: 'Drink 2L Water', icon: '💧' },
  { name: 'Grateful for 3 things', icon: '✨' },
];

export const AddHabitModal: React.FC<AddHabitModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('General');
  const [goal, setGoal] = useState('');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({
      name,
      category,
      icon: '✨',
      color: '#6366f1',
      frequency: 'daily'
    });
    setName('');
    onClose();
  };

  const handleAISuggest = async () => {
    if (!goal.trim()) return;
    setIsAIThinking(true);
    const suggestions = await suggestHabits(goal);
    setAiSuggestions(suggestions);
    setIsAIThinking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg bg-slate-900/40 backdrop-blur-2xl rounded-[40px] border border-white/20 shadow-2xl overflow-hidden"
      >
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <h2 className="text-xl font-bold text-white tracking-tight">Initialize Habit</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-white/40" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Habit Label</label>
            <input
              autoFocus
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Record your action..."
              className="w-full px-5 py-4 bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 rounded-2xl outline-none transition-all text-white text-lg font-bold placeholder:text-white/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-white/30 uppercase tracking-widest">Classify</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={cn(
                    "px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/10 uppercase tracking-widest",
                    category === cat 
                      ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/30" 
                      : "bg-white/5 text-white/40 hover:border-white/30"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-4 text-blue-400">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">AI Core Engine</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Define your objective..."
                className="flex-1 px-4 py-2 bg-white/5 rounded-xl outline-none text-xs text-white placeholder:text-white/20 border border-white/10 focus:border-blue-500/50"
              />
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={isAIThinking}
                className="px-4 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                {isAIThinking ? '...' : 'Query'}
              </button>
            </div>
            
            {aiSuggestions.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {aiSuggestions.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setName(s)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 text-blue-400 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    + {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-white text-slate-900 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3"
          >
            Deploy Habit
            <Target size={18} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// Re-using cn here locally to ensure independence if needed, but imported works too
import { cn } from '../lib/utils';
