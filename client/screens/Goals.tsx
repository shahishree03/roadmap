import React, { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { AppLayout } from '../components/layout/AppLayout';
import { GoalType, MetricType, Goal, Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Plus, 
  ChevronRight, 
  Target, 
  Zap, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  BarChart3,
  Timer,
  BookOpen,
  Layout
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const goalTypes: { id: GoalType; label: string; icon: any; color: string }[] = [
  { id: 'daily', label: 'Daily', icon: Zap, color: 'text-orange-500 bg-orange-50' },
  { id: 'short', label: 'Short', icon: Timer, color: 'text-blue-500 bg-blue-50' },
  { id: 'mid', label: 'Mid', icon: Target, color: 'text-indigo-500 bg-indigo-50' },
  { id: 'long', label: 'Long', icon: Layout, color: 'text-violet-500 bg-violet-50' },
];

const Goals = () => {
  const { goals, addGoal, deleteGoal, addTask, toggleTask, deleteTask } = useStore();
  const [activeType, setActiveType] = useState<GoalType>('daily');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [isAddingTask, setIsAddingTask] = useState<string | null>(null);
  
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskMetric, setNewTaskMetric] = useState<MetricType>('tasks');
  const [newTaskValue, setNewTaskValue] = useState('1');

  const [activeMetric, setActiveMetric] = useState<MetricType>('tasks');

  const filteredGoals = goals.filter(g => g.type === activeType);

  const handleAddGoal = () => {
    if (!newGoalTitle.trim()) return;
    addGoal({ title: newGoalTitle, type: activeType });
    setNewGoalTitle('');
    setIsAddingGoal(false);
  };

  const handleAddTask = (goalId: string) => {
    if (!newTaskTitle.trim()) return;
    addTask(goalId, {
      title: newTaskTitle,
      metricType: newTaskMetric,
      value: parseInt(newTaskValue) || 1
    });
    setNewTaskTitle('');
    setIsAddingTask(null);
  };

  // Prepare data for the graph
  const chartData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, i) => {
      const isToday = i === (new Date().getDay() + 6) % 7;
      const progressFactor = isToday ? 0.8 : 0.4 + Math.random() * 0.5;

      return {
        name: day,
        hours: Math.floor(progressFactor * 8),
        tasks: Math.floor(progressFactor * 12),
        questions: Math.floor(progressFactor * 5)
      };
    });
  }, [activeType]);

  const activeColor = goalTypes.find(t => t.id === activeType)?.color.split(' ')[0] || 'text-indigo-500';
  const metricColors = {
    tasks: '#6366f1',
    hours: '#f97316',
    questions: '#8b5cf6'
  };

  return (
    <AppLayout>
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Personal Execution</h1>
        <p className="text-slate-500 font-medium">Strategic goals & daily discipline</p>
      </header>

      {/* Tabs */}
      <div className="flex bg-slate-100/50 p-1.5 rounded-[2rem] mb-8 overflow-hidden backdrop-blur-sm border border-slate-200/30">
        {goalTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={cn(
              "flex-1 flex flex-col items-center gap-1.5 py-4 transition-all duration-300 relative rounded-[1.5rem]",
              activeType === type.id ? "bg-white shadow-xl shadow-slate-200/50 text-slate-900" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <type.icon className={cn("w-5 h-5", activeType === type.id ? type.color.split(' ')[0] : "")} />
            <span className="text-[9px] font-bold uppercase tracking-widest">{type.label}</span>
            {activeType === type.id && (
              <motion.div layoutId="goal-type-glow" className="absolute inset-0 bg-white -z-10 rounded-[1.5rem]" />
            )}
          </button>
        ))}
      </div>

      {/* Analytics Graph */}
      <Card className="rounded-[2.5rem] border-none bg-slate-50 p-6 mb-10 overflow-hidden">
        <div className="flex justify-between items-center mb-6 px-2">
          <div>
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Performance</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Day-wise Progress</p>
          </div>
          <div className="flex gap-1 bg-white/50 p-1 rounded-xl">
            {(['tasks', 'hours', 'questions'] as const).map(m => (
              <button
                key={m}
                onClick={() => setActiveMetric(m)}
                className={cn(
                  "px-2 py-1 rounded-lg text-[9px] font-black uppercase transition-all",
                  activeMetric === m ? "bg-white text-slate-900 shadow-sm" : "text-slate-400"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={metricColors[activeMetric]} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={metricColors[activeMetric]} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area
                type="monotone"
                dataKey={activeMetric}
                stroke={metricColors[activeMetric]}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Goal List */}
      <div className="space-y-6 pb-24">
        <div className="flex justify-between items-center px-2">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {activeType} Goals
          </h2>
          <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
            <DialogTrigger asChild>
              <button className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create {activeType} Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input 
                  placeholder="e.g., Learn React Native" 
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                />
                <Button className="w-full rounded-xl" onClick={handleAddGoal}>Create Goal</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredGoals.map((goal, idx) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 group overflow-hidden relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 leading-tight mb-2">{goal.title}</h3>
                    <div className="flex items-center gap-3">
                       <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                         <span className="text-[10px] font-black text-indigo-600">{goal.progress}%</span>
                         <div className="w-12 h-1 bg-slate-200 rounded-full overflow-hidden">
                           <div className="h-full bg-indigo-500" style={{ width: `${goal.progress}%` }} />
                         </div>
                       </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteGoal(goal.id)}
                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Tasks */}
                <div className="space-y-3">
                   {goal.tasks.map(task => (
                     <div key={task.id} className="flex items-center justify-between group/task">
                        <div 
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => toggleTask(goal.id, task.id)}
                        >
                           <div className={cn(
                             "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
                             task.completed ? "bg-emerald-500 border-emerald-500 text-white" : "border-slate-100 text-transparent"
                           )}>
                             <CheckCircle2 className="w-4 h-4" />
                           </div>
                           <div>
                             <p className={cn("text-sm font-bold text-slate-700", task.completed && "line-through opacity-50")}>{task.title}</p>
                             <div className="flex gap-2">
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                 {task.metricType}: {task.value}
                               </span>
                             </div>
                           </div>
                        </div>
                        <button 
                          onClick={() => deleteTask(goal.id, task.id)}
                          className="opacity-0 group-hover/task:opacity-100 p-1 text-slate-300 hover:text-red-400 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                     </div>
                   ))}

                   <Dialog open={isAddingTask === goal.id} onOpenChange={(open) => setIsAddingTask(open ? goal.id : null)}>
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mt-4 hover:opacity-70 transition-opacity">
                        <Plus className="w-4 h-4" /> Add Task
                      </button>
                    </DialogTrigger>
                    <DialogContent className="rounded-[2rem]">
                      <DialogHeader>
                        <DialogTitle>Add Task to {goal.title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <Input 
                          placeholder="Task title" 
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <Select value={newTaskMetric} onValueChange={(v: MetricType) => setNewTaskMetric(v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Metric" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="tasks">Tasks</SelectItem>
                              <SelectItem value="hours">Hours</SelectItem>
                              <SelectItem value="questions">Questions</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input 
                            type="number" 
                            placeholder="Value" 
                            value={newTaskValue}
                            onChange={(e) => setNewTaskValue(e.target.value)}
                          />
                        </div>
                        <Button className="w-full rounded-xl" onClick={() => handleAddTask(goal.id)}>Add Task</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredGoals.length === 0 && (
            <div className="text-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold mb-4">No {activeType} goals yet</p>
              <Button 
                variant="outline" 
                className="rounded-full uppercase text-[10px] font-black tracking-widest"
                onClick={() => setIsAddingGoal(true)}
              >
                Create Goal
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Goals;
