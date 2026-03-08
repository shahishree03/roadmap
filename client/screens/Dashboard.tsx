import React from 'react';
import { useStore } from '../store/useStore';
import { AppLayout } from '../components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Circle, Clock, Flame, Target, Zap, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { useStrategicScore } from '../hooks/useStrategicScore';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const { goals, toggleTask } = useStore();
  const { finalScore, roadmapProgress, executionVelocity, networkStrength } = useStrategicScore();

  const today = new Date().toISOString().split('T')[0];

  // Today's pending tasks from all goal types
  const todayTasks = goals.flatMap(g =>
    g.tasks.filter(t => !t.completed && (g.type === 'daily' || t.date.split('T')[0] === today))
  );

  // Recently updated tasks (last 5 completed or updated)
  const recentUpdates = goals.flatMap(g =>
    g.tasks.filter(t => t.completed).map(t => ({ ...t, goalTitle: g.title }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  const goalTypeLabels = {
    daily: 'Daily',
    short: 'Short-Term',
    mid: 'Mid-Term',
    long: 'Long-Term'
  };

  const getProgressForType = (type: string) => {
    const typeGoals = goals.filter(g => g.type === type);
    if (typeGoals.length === 0) return 0;
    const totalProgress = typeGoals.reduce((acc, g) => acc + g.progress, 0);
    return Math.round(totalProgress / typeGoals.length);
  };

  return (
    <AppLayout>
      <header className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Focus, Navin</h1>
          <p className="text-slate-500 font-medium">Your personal execution system.</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        </div>
      </header>

      {/* Main Strategic Score */}
      <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <TrendingUp className="w-32 h-32 text-white" />
        </div>
        <CardContent className="p-8 flex items-center justify-between text-white relative z-10">
          <div className="space-y-2">
            <h2 className="text-lg font-bold opacity-60">Strategic Score</h2>
            <div className="flex items-baseline gap-2">
              <p className="text-6xl font-black">{finalScore}</p>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">+5.2%</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">System Velocity</p>
          </div>

          <div className="flex flex-col gap-3">
             {[
               { label: 'Execution', val: executionVelocity, color: 'bg-blue-500' },
               { label: 'Strategy', val: roadmapProgress, color: 'bg-indigo-500' },
               { label: 'Network', val: networkStrength, color: 'bg-violet-500' }
             ].map((stat) => (
               <div key={stat.label} className="text-right">
                  <p className="text-[9px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
                       <div className={cn("h-full", stat.color)} style={{ width: `${stat.val}%` }} />
                    </div>
                    <span className="text-xs font-black w-8">{stat.val}%</span>
                  </div>
               </div>
             ))}
          </div>
        </CardContent>
      </Card>

      {/* Progress Summaries */}
      <section className="mb-10">
        <div className="flex justify-between items-center px-2 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Progress Summary</h3>
          <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {(['daily', 'short', 'mid', 'long'] as const).map((type) => (
            <Card key={type} className="rounded-[2rem] border-slate-100 shadow-sm p-5 hover:border-indigo-200 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center",
                  type === 'daily' ? "bg-orange-50 text-orange-500" :
                  type === 'short' ? "bg-blue-50 text-blue-500" :
                  type === 'mid' ? "bg-indigo-50 text-indigo-500" :
                  "bg-violet-50 text-violet-500"
                )}>
                  <Target className="w-5 h-5" />
                </div>
                <span className="text-lg font-black text-slate-900">{getProgressForType(type)}%</span>
              </div>
              <h4 className="font-bold text-slate-800 text-sm">{goalTypeLabels[type]}</h4>
              <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressForType(type)}%` }}
                  className={cn(
                    "h-full",
                    type === 'daily' ? "bg-orange-500" :
                    type === 'short' ? "bg-blue-500" :
                    type === 'mid' ? "bg-indigo-500" :
                    "bg-violet-500"
                  )}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Today's Tasks */}
      <section className="mb-10">
        <div className="flex justify-between items-center px-2 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Today's Focus</h3>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-tighter">
            {todayTasks.length} Pending
          </span>
        </div>

        <div className="space-y-4">
          {todayTasks.length > 0 ? (
            todayTasks.slice(0, 4).map((task) => (
              <motion.div
                key={task.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  const goal = goals.find(g => g.tasks.some(t => t.id === task.id));
                  if (goal) toggleTask(goal.id, task.id);
                }}
                className="bg-white rounded-[1.8rem] p-5 shadow-sm border border-slate-100 flex items-center justify-between group cursor-pointer hover:border-indigo-100 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all",
                    task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-100 group-hover:border-indigo-200 text-transparent"
                  )}>
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={cn("font-bold text-slate-700 block leading-tight", task.completed && "line-through opacity-50")}>{task.title}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{task.metricType}: {task.value}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
              </motion.div>
            ))
          ) : (
            <div className="bg-slate-50 rounded-[2rem] p-10 text-center border-2 border-dashed border-slate-200">
               <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
               <p className="text-slate-400 font-bold">All clear for today!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Updates */}
      <section className="mb-20">
        <div className="flex justify-between items-center px-2 mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Updates</h3>
          <button className="text-xs font-bold text-slate-400 uppercase tracking-widest">History</button>
        </div>

        <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-2 border border-white/50 shadow-sm overflow-hidden">
          {recentUpdates.length > 0 ? (
            recentUpdates.map((update, idx) => (
              <div key={update.id} className={cn(
                "p-5 flex items-center gap-4",
                idx !== recentUpdates.length - 1 && "border-b border-slate-100/50"
              )}>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{update.title}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed in {update.goalTitle}</p>
                </div>
                <span className="text-[10px] font-black text-slate-300 uppercase shrink-0">
                  {new Date(update.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          ) : (
            <p className="p-8 text-center text-slate-400 font-medium text-sm">No recent updates</p>
          )}
        </div>
      </section>
    </AppLayout>
  );
};

export default Dashboard;
