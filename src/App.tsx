/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays, isSameDay } from 'date-fns';
import { Plus, LayoutGrid, CheckCircle, Activity, Settings, Zap, ArrowRight, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Habit, Completion } from './types';
import { HabitCard } from './components/HabitCard';
import { Dashboard } from './components/Dashboard';
import { AddHabitModal } from './components/AddHabitModal';
import { getHealthTip } from './services/aiService';
import { cn } from './lib/utils';

export default function App() {
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habitflow_habits');
    return saved ? JSON.parse(saved) : [];
  });

  const [completions, setCompletions] = useState<Completion[]>(() => {
    const saved = localStorage.getItem('habitflow_completions');
    return saved ? JSON.parse(saved) : [];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'daily' | 'dashboard'>('daily');
  const [aiTip, setAiTip] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('habitflow_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('habitflow_completions', JSON.stringify(completions));
  }, [completions]);

  useEffect(() => {
    const fetchTip = async () => {
      if (habits.length > 0) {
        const tip = await getHealthTip(habits.map(h => h.name));
        setAiTip(tip);
      }
    };
    fetchTip();
  }, [habits.length]);

  const toggleHabit = (habitId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const existing = completions.find(c => c.habitId === habitId && c.date === today);

    if (existing) {
      setCompletions(completions.filter(c => !(c.habitId === habitId && c.date === today)));
    } else {
      setCompletions([...completions, { habitId, date: today }]);
    }
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
    setCompletions(completions.filter(c => c.habitId !== id));
  };

  const addHabit = (newHabit: Omit<Habit, 'id' | 'createdAt'>) => {
    const habit: Habit = {
      ...newHabit,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now()
    };
    setHabits([habit, ...habits]);
  };

  const calculateStreak = (habitId: string) => {
    let streak = 0;
    let checkDate = new Date();
    const todayStr = format(checkDate, 'yyyy-MM-dd');
    const hasToday = completions.some(c => c.habitId === habitId && c.date === todayStr);
    
    // Start checking from yesterday if not completed today, or today if completed
    if (!hasToday) {
      checkDate = subDays(checkDate, 1);
    }

    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const isCompleted = completions.some(c => c.habitId === habitId && c.date === dateStr);
      
      if (isCompleted) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const habitsWithStatus = useMemo(() => habits.map(h => ({
    ...h,
    completed: completions.some(c => c.habitId === h.id && c.date === todayStr),
    streak: calculateStreak(h.id)
  })), [habits, completions, todayStr]);

  return (
    <div className="relative min-h-screen font-sans selection:bg-indigo-100/30 text-white overflow-hidden flex items-center justify-center p-4">
      <div className="mesh-bg" />
      
      <div className="glass-panel w-full max-w-6xl h-[90vh] rounded-[40px] z-10 flex overflow-hidden shadow-2xl">
        {/* Sidebar */}
        <aside className="w-20 md:w-64 border-r border-white/10 bg-white/5 flex flex-col items-center md:items-stretch p-4 md:p-8 transition-all">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-blue-500/20 border border-blue-500/50 rounded-xl flex items-center justify-center text-blue-400">
              <Zap size={24} fill="currentColor" />
            </div>
            <span className="hidden md:block font-bold text-2xl tracking-tighter">HabitFolio.</span>
          </div>

          <nav className="flex-1 space-y-4">
            <button
              onClick={() => setView('daily')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                view === 'daily' 
                  ? "bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <LayoutGrid size={22} />
              <span className="hidden md:block">Dashboard</span>
            </button>
            <button
              onClick={() => setView('dashboard')}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-2xl transition-all",
                view === 'dashboard' 
                  ? "bg-blue-500/20 border border-blue-500/30 text-blue-400 font-bold" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Activity size={22} />
              <span className="hidden md:block">Statistics</span>
            </button>
          </nav>

          <div className="mt-auto hidden md:block">
            <div className="flex items-center p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 mr-3 shadow-lg shadow-blue-500/20"></div>
              <div>
                <p className="text-white text-sm font-semibold">Alex Rivera</p>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-wider">Pro Plan</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col">
          <div className="w-full">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-white/50 font-medium mb-1">{format(new Date(), 'EEEE, MMM d')}</p>
                <motion.h1 
                  layout
                  className="text-4xl md:text-5xl font-bold tracking-tight text-white"
                >
                  {view === 'daily' ? "Keep it up, Alex!" : "System Activity"}
                </motion.h1>
              </div>

              {view === 'daily' && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-[20px] font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 group"
                >
                  <Plus size={20} />
                  Add Habit
                </button>
              )}
            </header>

            {/* AI Banner */}
            <AnimatePresence mode="wait">
              {aiTip && view === 'daily' && habits.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="mb-8 p-6 rounded-[32px] bg-white/5 border border-white/10 flex items-center gap-5 backdrop-blur-md"
                >
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Zap size={24} fill="currentColor" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">AI INSIGHT</p>
                    <p className="text-white/80 font-medium text-lg leading-snug">"{aiTip}"</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {view === 'daily' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {habitsWithStatus.length > 0 ? (
                    habitsWithStatus.map((habit) => (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        isCompleted={habit.completed}
                        streak={habit.streak}
                        onToggle={toggleHabit}
                        onDelete={deleteHabit}
                      />
                    ))
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="col-span-full text-center py-24 px-8 border-2 border-dashed border-white/10 rounded-[40px] bg-white/5"
                    >
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-white/20 mx-auto mb-4 border border-white/10">
                        <Plus size={32} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Initialize Habits</h3>
                      <p className="text-white/40 mb-8 max-w-xs mx-auto">Your productivity board is currently empty.</p>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="text-blue-400 font-bold flex items-center gap-2 mx-auto hover:gap-3 transition-all"
                      >
                        Start tracking <ArrowRight size={18} />
                      </button>
                    </motion.div>
                  )}
                </div>
              ) : (
                <Dashboard habits={habits} completions={completions} />
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addHabit}
      />
    </div>
  );
}

