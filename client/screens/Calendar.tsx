import React, { useState } from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Link as LinkIcon, Plus, ChevronLeft, ChevronRight, Import, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isConnected, setIsConnected] = useState(false);
  
  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  
  // Simple calendar grid generator
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  
  const daysInMonth = getDaysInMonth(currentYear, currentDate.getMonth());
  const firstDay = getFirstDayOfMonth(currentYear, currentDate.getMonth());
  
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const prevMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentDate.getMonth() + 1, 1));

  return (
    <AppLayout>
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{currentMonth}</h1>
          <p className="text-slate-500 font-medium">{currentYear}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-3 bg-white rounded-full shadow-sm border border-slate-100/50 hover:bg-slate-50">
            <ChevronLeft className="w-5 h-5 text-slate-400" />
          </button>
          <button onClick={nextMonth} className="p-3 bg-white rounded-full shadow-sm border border-slate-100/50 hover:bg-slate-50">
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </header>

      {/* Google Calendar Connect */}
      {!isConnected ? (
        <Card className="rounded-[2.5rem] border-none bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-200 mb-10 overflow-hidden group">
          <CardContent className="p-8 flex flex-col items-center text-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
               <Import className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold mb-2">Sync with Google</h2>
            <p className="text-sm opacity-80 mb-6 max-w-[200px]">Link your milestones to your Google Calendar events</p>
            <button 
              onClick={() => setIsConnected(true)}
              className="bg-white text-blue-600 font-black uppercase text-xs tracking-widest px-8 py-4 rounded-full shadow-xl hover:bg-blue-50 transition-colors"
            >
              Connect Now
            </button>
          </CardContent>
        </Card>
      ) : (
        <Card className="rounded-[2.5rem] border-none bg-emerald-50 mb-10 overflow-hidden border border-emerald-100/50">
           <CardContent className="p-6 flex items-center gap-4 text-emerald-700">
             <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
             </div>
             <div>
               <p className="text-sm font-black uppercase tracking-widest leading-none mb-1">Synced</p>
               <p className="text-xs font-bold opacity-70">Google Calendar Connected</p>
             </div>
           </CardContent>
        </Card>
      )}

      {/* Calendar Grid */}
      <div className="bg-white/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-200/50 shadow-sm mb-10">
        <div className="grid grid-cols-7 mb-4">
          {days.map((d, i) => (
            <div key={i} className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest py-2">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2">
          {calendarDays.map((day, i) => (
            <div key={i} className="aspect-square flex items-center justify-center relative">
               {day && (
                 <button className={cn(
                   "w-10 h-10 rounded-2xl font-bold text-sm transition-all",
                   day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() 
                     ? "bg-slate-900 text-white shadow-lg shadow-slate-300" 
                     : "text-slate-600 hover:bg-slate-50"
                 )}>
                   {day}
                 </button>
               )}
               {day === 14 && (
                 <div className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
               )}
               {day === 22 && (
                 <div className="absolute top-1 right-1 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-white" />
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Linked Events */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold text-slate-800 px-2">Upcoming Reminders</h3>
        <div className="space-y-4">
          <motion.div 
            whileTap={{ scale: 0.98 }}
            className="bg-white/80 rounded-[1.5rem] p-5 shadow-sm border border-slate-100/50 flex items-center gap-4"
          >
             <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center">
               <CalendarIcon className="w-6 h-6" />
             </div>
             <div className="flex-1">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">14 SEPT • 10:00 AM</p>
               <h4 className="font-bold text-slate-900">MVP Milestone Review</h4>
             </div>
             <LinkIcon className="w-5 h-5 text-slate-300" />
          </motion.div>
        </div>
        
        <button className="w-full py-5 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[1.5rem] text-slate-400 font-bold uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:border-slate-300 transition-all">
          <Plus className="w-4 h-4" /> Link New Milestone
        </button>
      </section>
    </AppLayout>
  );
};

export default Calendar;
