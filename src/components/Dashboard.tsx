import React from 'react';
import { Habit, Completion } from '../types';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, TrendingUp, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DashboardProps {
  habits: Habit[];
  completions: Completion[];
}

export const Dashboard: React.FC<DashboardProps> = ({ habits, completions }) => {
  const today = new Date();
  const start = startOfWeek(today, { weekStartsOn: 1 });
  const end = endOfWeek(today, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start, end });

  const chartData = days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const count = completions.filter(c => c.date === dayStr).length;
    return {
      name: format(day, 'EEE'),
      completions: count,
    };
  });

  const totalCompletions = completions.length;
  const completedToday = completions.filter(c => c.date === format(today, 'yyyy-MM-dd')).length;
  const completionRate = habits.length > 0 ? (completedToday / habits.length) * 100 : 0;

  const stats = [
    { label: 'Total Wins', value: totalCompletions, icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'Today Progress', value: `${Math.round(completionRate)}%`, icon: TrendingUp, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Active Habits', value: habits.length, icon: Calendar, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white/30 uppercase tracking-widest">{stat.label}</span>
              <div className={cn("p-2 rounded-xl bg-white/5 border border-white/10", stat.color)}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white tracking-tighter">{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 bg-white/5 border border-white/10 rounded-[40px] backdrop-blur-md"
      >
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">System Performance</h2>
            <p className="text-white/40 text-sm">Real-time consistency metrics</p>
          </div>
          <div className="flex items-center gap-2 text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-2xl font-bold text-[10px] uppercase tracking-widest">
            <CheckCircle2 size={14} />
            <span>Operational</span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 700 }} 
                dy={15}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                  borderRadius: '16px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(12px)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
                }}
                itemStyle={{ color: '#fff' }}
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
              />
              <Area 
                type="monotone" 
                dataKey="completions" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCompletions)" 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
};
