import React from 'react';
import { useStore } from '../store/useStore';
import { AppLayout } from '../components/layout/AppLayout';
import { ThreeDBarChart } from '../charts/ThreeDBarChart';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart3, TrendingUp, Calendar, Zap } from 'lucide-react';

const Analytics = () => {
  const { goals } = useStore();

  const chartData = (['daily', 'short', 'mid', 'long'] as const).map((type) => {
    const typeGoals = goals.filter(g => g.type === type);
    const percentage = typeGoals.length > 0
      ? Math.round(typeGoals.reduce((acc, g) => acc + g.progress, 0) / typeGoals.length)
      : 0;

    let color = '#6366f1'; // Default indigo
    if (type === 'daily') color = '#f97316'; // Orange
    if (type === 'short') color = '#3b82f6'; // Blue
    if (type === 'mid') color = '#6366f1'; // Indigo
    if (type === 'long') color = '#8b5cf6'; // Violet

    return {
      label: type.charAt(0).toUpperCase() + type.slice(1),
      value: percentage,
      color,
    };
  });

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-slate-500 font-medium">Measuring your execution strategy.</p>
      </header>

      <div className="space-y-6">
        {/* Main 3D Chart Card */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-500" /> Execution Depth
            </h3>
          </div>
          <ThreeDBarChart data={chartData} />
        </div>

        {/* Weekly Stats */}
        <section className="grid grid-cols-2 gap-4">
          <Card className="rounded-[2rem] border-none bg-indigo-50/50 p-6 flex flex-col gap-3">
             <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
               <TrendingUp className="w-5 h-5" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-indigo-600/70 uppercase tracking-wider">Weekly Gain</p>
               <p className="text-2xl font-black text-indigo-950">+12%</p>
             </div>
          </Card>
          <Card className="rounded-[2rem] border-none bg-amber-50/50 p-6 flex flex-col gap-3">
             <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
               <Zap className="w-5 h-5" />
             </div>
             <div>
               <p className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider">Efficiency</p>
               <p className="text-2xl font-black text-amber-950">High</p>
             </div>
          </Card>
        </section>

        {/* Goal Projection */}
        <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm border border-slate-100/50 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 rotate-12" />
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-black text-slate-900 leading-tight">Projected Goal<br/>Completion</h3>
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl font-black text-slate-900 border border-slate-100">
                 14
               </div>
               <div>
                 <p className="text-sm font-bold text-slate-900">Sept 2025</p>
                 <p className="text-xs font-medium text-slate-400">All primary milestones</p>
               </div>
            </div>
            <p className="text-xs font-bold text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full inline-block uppercase tracking-widest">ON TRACK</p>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Analytics;
