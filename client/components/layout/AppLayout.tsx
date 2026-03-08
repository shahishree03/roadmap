import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, Users, Calendar, BarChart3, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { id: 'goals', label: 'Execution', icon: Map, path: '/goals' },
  { id: 'network', label: 'Network', icon: Users, path: '/network' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white/50 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      <main className="flex-1 pb-24 overflow-y-auto px-6 pt-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-md border-t border-slate-200/50 pb-8 pt-3 px-6 z-50">
        <div className="flex justify-between items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center gap-1 transition-all duration-300 relative group",
                  isActive ? "text-primary scale-110" : "text-muted-foreground hover:text-slate-600"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-6 h-6", isActive ? "stroke-[2.5px]" : "stroke-2")} />
                  <span className="text-[10px] font-semibold uppercase tracking-wider">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
};
