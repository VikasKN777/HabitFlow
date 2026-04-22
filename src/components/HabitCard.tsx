import React from 'react';
import { Habit, Completion } from '../types';
import { cn } from '../lib/utils';
import { Check, Flame, Trophy, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface HabitCardProps {
  habit: Habit;
  isCompleted: boolean;
  streak: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({ 
  habit, 
  isCompleted, 
  streak, 
  onToggle, 
  onDelete 
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "habit-glass-card group relative p-6 rounded-[32px] flex flex-col justify-between min-h-[160px]",
        isCompleted && "bg-white/10 border-white/20"
      )}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-4 border border-blue-400/30">
            <span className="text-2xl">{habit.icon}</span>
          </div>
          <h3 className={cn(
            "text-xl font-bold text-white transition-all",
            isCompleted && "opacity-50"
          )}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/40 text-sm">{habit.category}</span>
            {streak > 0 && (
              <>
                <span className="text-white/20">•</span>
                <div className="flex items-center gap-1 text-orange-400 text-xs font-bold uppercase tracking-wider">
                  <Flame size={14} fill="currentColor" />
                  <span>{streak} Days</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-4">
          <button
            onClick={() => onToggle(habit.id)}
            className={cn(
              "relative w-16 h-16 flex items-center justify-center transition-all duration-500",
              "rounded-full border-4",
              isCompleted 
                ? "bg-blue-500/20 border-blue-400 text-white shadow-lg shadow-blue-500/30" 
                : "bg-white/5 border-white/10 text-white/20 hover:border-white/30"
            )}
          >
            {isCompleted ? (
              <span className="text-[10px] font-black tracking-widest">DONE</span>
            ) : (
              <Check size={24} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </button>
          
          <button
            onClick={() => onDelete(habit.id)}
            className="opacity-0 group-hover:opacity-100 p-2 text-white/20 hover:text-red-400 transition-all rounded-xl hover:bg-white/5"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="flex gap-1.5 mt-6 h-1.5">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i}
            className={cn(
              "flex-1 rounded-full transition-all duration-500",
              i < (streak % 7 || (streak > 0 ? 7 : 0))
                ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.5)]" 
                : "bg-white/10"
            )}
          />
        ))}
      </div>
    </motion.div>
  );
};
