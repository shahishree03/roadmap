import React from 'react';
import { AppLayout } from '../components/layout/AppLayout';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, HelpCircle, LogOut, ChevronRight, Moon, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const SettingItem = ({ icon: Icon, label, value, type = 'chevron', color = 'text-slate-400' }: any) => (
  <motion.div 
    whileTap={{ scale: 0.98 }}
    className="bg-white/80 rounded-[1.5rem] p-5 shadow-sm border border-slate-100/50 flex items-center gap-4 cursor-pointer hover:bg-white transition-all"
  >
    <div className={cn("w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-slate-100", color)}>
       <Icon className="w-6 h-6" />
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-slate-900 leading-tight">{label}</h4>
      {value && <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{value}</p>}
    </div>
    {type === 'chevron' ? (
      <ChevronRight className="w-5 h-5 text-slate-300" />
    ) : (
      <Switch checked={value === 'on'} onCheckedChange={() => {}} />
    )}
  </motion.div>
);

const Settings = () => {
  return (
    <AppLayout>
      <header className="mb-10 text-center">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 font-medium">Control your productivity flow</p>
      </header>

      {/* User Profile Card */}
      <Card className="rounded-[2.5rem] border-none bg-white p-8 shadow-sm border border-slate-100/50 mb-10 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-rose-500" />
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] mx-auto mb-4 flex items-center justify-center relative shadow-lg shadow-slate-100">
           <User className="w-10 h-10 text-slate-400" />
           <div className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-500 rounded-full border-4 border-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
           </div>
        </div>
        <h2 className="text-xl font-black text-slate-900 leading-tight">Navin Pandit</h2>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Strategic Director</p>
        <button className="mt-6 text-xs font-black uppercase text-indigo-600 bg-indigo-50 px-6 py-2.5 rounded-full tracking-widest hover:bg-indigo-100 transition-colors">Edit Profile</button>
      </Card>

      <section className="space-y-4 mb-10">
        <h3 className="text-lg font-bold text-slate-800 px-2 mb-4">Preferences</h3>
        <SettingItem icon={Bell} label="Notifications" value="Push enabled" color="text-indigo-500" />
        <SettingItem icon={Moon} label="Dark Mode" value="off" type="switch" color="text-slate-900" />
        <SettingItem icon={Shield} label="Privacy & Security" value="Enhanced" color="text-rose-500" />
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 px-2 mb-4">About</h3>
        <SettingItem icon={HelpCircle} label="Help & Support" color="text-emerald-500" />
        <SettingItem icon={LogOut} label="Log Out" color="text-slate-400" />
      </section>

      <div className="mt-12 text-center pb-10">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest leading-relaxed">ROADMAP TRACKER v1.0.2<br/>PROUDLY DEVELOPED WITH FUSION</p>
      </div>
    </AppLayout>
  );
};

export default Settings;
