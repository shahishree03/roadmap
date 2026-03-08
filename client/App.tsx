import { useEffect } from "react";
import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./screens/Dashboard";
import Goals from "./screens/Goals";
import NetworkScreen from "./screens/Network";
import Calendar from "./screens/Calendar";
import Analytics from "./screens/Analytics";
import Settings from "./screens/Settings";
import NotFound from "./pages/NotFound";
import { useStore } from "./store/useStore";

const App = () => {
  const resetDailyGoals = useStore((state) => state.resetDailyGoals);

  useEffect(() => {
    resetDailyGoals();
  }, [resetDailyGoals]);

  return (
    <>
      <Toaster />
      <Sonner />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/network" element={<NetworkScreen />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
