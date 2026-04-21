import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, TabId } from './components/layout/Sidebar';
import { storageService } from './services/storageService';
import { Lead, UserSettings } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

// Screens
import { Comando } from './components/screens/Comando';
import { Leads } from './components/screens/Leads';
import { Pipeline } from './components/screens/Pipeline';
import { Miami } from './components/screens/Miami';
import { Config } from './components/screens/Config';
import { Onboarding } from './components/screens/Onboarding';
import { QuickAddModal } from './components/modals/QuickAddModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('comando');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [settings, setSettings] = useState<UserSettings>(storageService.getSettings());
  const [isInitialized, setIsInitialized] = useState<boolean>(storageService.isInitialized());
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  useEffect(() => {
    setLeads(storageService.getLeads());
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Fullscreen on Alt + 1
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.warn(`Fullscreen error: ${err.message}`);
          });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const refreshData = () => {
    setLeads(storageService.getLeads());
    setSettings(storageService.getSettings());
  };

  const urgentCount = useMemo(() => {
    const threshold = Date.now() - (settings.followUpAlertHours * 60 * 60 * 1000);
    return leads.filter(l => 
      l.status !== 'CERRADOS' && 
      l.status !== 'PERDIDOS' && 
      l.lastInteractionAt < threshold
    ).length;
  }, [leads, settings.followUpAlertHours]);

  const attentionNeeded = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const dmsToday = leads.filter(l => l.createdAt >= today).length;
    return dmsToday < settings.dailyDmGoal && new Date().getHours() >= 12;
  }, [leads, settings.dailyDmGoal]);

  if (!isInitialized) {
    return (
      <Onboarding 
        onComplete={(newSettings) => {
          storageService.saveSettings(newSettings);
          storageService.setInitialized();
          setSettings(newSettings);
          setIsInitialized(true);
        }} 
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-vx-black relative">
      <div className="scanline" />
      
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        urgentCount={urgentCount}
        attentionNeeded={attentionNeeded}
      />
      
      <main className="flex-1 ml-16 relative overflow-x-hidden">
        {/* Top Fixed Urgency Banner */}
        <AnimatePresence>
          {urgentCount > 0 && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 48, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-vx-burgundy/5 border-b border-vx-burgundy/30 flex items-center justify-between px-8 sticky top-0 bg-vx-black z-30 overflow-hidden"
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-vx-burgundy animate-pulse-urgency" />
                <span className="label-mono text-vx-burgundy text-[10px]">
                  {urgentCount} LEADS LLEVAN MÁS DE {settings.followUpAlertHours}H SIN RESPUESTA
                </span>
              </div>
              <button 
                onClick={() => setActiveTab('leads')}
                className="font-mono text-[9px] uppercase tracking-tighter border border-vx-burgundy px-4 py-1 text-vx-burgundy hover:bg-vx-burgundy hover:text-vx-cream transition-all"
              >
                Filtrar Ahora
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-8 pb-24 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'comando' && <Comando leads={leads} settings={settings} onQuickAdd={() => setIsQuickAddOpen(true)} />}
              {activeTab === 'leads' && <Leads leads={leads} settings={settings} onRefresh={refreshData} />}
              {activeTab === 'pipeline' && <Pipeline leads={leads} settings={settings} />}
              {activeTab === 'miami' && <Miami leads={leads} settings={settings} />}
              {activeTab === 'config' && <Config settings={settings} onRefresh={refreshData} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Global Quick Add Button */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-vx-gold rounded-full flex items-center justify-center text-vx-black shadow-2xl hover:scale-110 active:scale-95 transition-all z-40"
        >
          <Plus size={24} />
        </button>

        <QuickAddModal 
          isOpen={isQuickAddOpen} 
          onClose={() => setIsQuickAddOpen(false)} 
          onSuccess={() => {
            refreshData();
            setIsQuickAddOpen(false);
          }}
        />
      </main>
    </div>
  );
}

