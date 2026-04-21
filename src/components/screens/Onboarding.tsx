import React, { useState } from 'react';
import { UserSettings } from '../../types';
import { motion } from 'motion/react';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [settings, setSettings] = useState<UserSettings>({
    miamiGoalClients: 20,
    miamiLifeCost: 8000,
    setupPrice: 500,
    retainerPrice: 300,
    followUpAlertHours: 48,
    dailyDmGoal: 40
  });

  return (
    <div className="fixed inset-0 bg-vx-black flex items-center justify-center p-6 z-[100]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="vx-card max-w-lg w-full space-y-10"
      >
        <div className="space-y-2">
          <h1 className="text-4xl text-vx-cream tracking-tight">VORTEXIA</h1>
          <p className="label-mono">Millón — Sistema Operativo Personal</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="label-mono">Meta Clientes Miami</label>
              <input 
                type="number" 
                value={settings.miamiGoalClients}
                onChange={(e) => setSettings({...settings, miamiGoalClients: Number(e.target.value)})}
                className="vx-input text-2xl font-serif"
              />
            </div>
            <div className="space-y-2">
              <label className="label-mono">Costo Vida Miami (USD)</label>
              <input 
                type="number" 
                value={settings.miamiLifeCost}
                onChange={(e) => setSettings({...settings, miamiLifeCost: Number(e.target.value)})}
                className="vx-input text-2xl font-serif"
              />
            </div>
          </div>

          <div className="p-4 bg-vx-gold-dim border border-vx-gold/20 rounded-sm">
            <p className="text-sm text-vx-parchment leading-relaxed italic">
              "No es un CRM. Es el sistema que convierte 40 DMs diarios en un millón de dólares."
            </p>
          </div>
          
          <button 
            onClick={() => onComplete(settings)}
            className="vx-btn-primary w-full"
          >
            Iniciar Sistema
          </button>
        </div>
      </motion.div>
    </div>
  );
}
