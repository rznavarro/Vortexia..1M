import React, { useMemo, useState } from 'react';
import { Lead, UserSettings } from '../../types';
import { motion } from 'motion/react';
import { formatCurrency, formatNumber, cn } from '../../lib/utils';
import { Palmtree, ArrowRight, DollarSign, Target, Calendar, TrendingUp } from 'lucide-react';

interface MiamiProps {
  leads: Lead[];
  settings: UserSettings;
}

export function Miami({ leads, settings }: MiamiProps) {
  // Simulator states
  const [simDms, setSimDms] = useState(40);
  const [simResponseRate, setSimResponseRate] = useState(24);
  const [simCloseRate, setSimCloseRate] = useState(10);

  const activeClients = useMemo(() => leads.filter(l => l.status === 'CERRADOS').length, [leads]);
  const currentMrr = activeClients * settings.retainerPrice;
  const setupFeesThisMonth = activeClients * settings.setupPrice;
  const totalMonthlyIncome = currentMrr + (setupFeesThisMonth / 12); // Smoothing setup fees

  const clientsNeeded = Math.max(0, settings.miamiGoalClients - activeClients);
  const mrrNeeded = settings.miamiLifeCost;
  const gap = mrrNeeded - currentMrr;

  // Projection logic
  const monthlyClozures = 3; // Mock average based on current data
  const monthsToGoal = monthlyClozures > 0 ? Math.ceil(clientsNeeded / monthlyClozures) : 0;
  
  const estimatedDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + monthsToGoal);
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  }, [monthsToGoal]);

  // Million dollar calculator
  const cumulativeEarnings = leads.filter(l => l.status === 'CERRADOS').length * (settings.setupPrice + settings.retainerPrice * 3); // Mocking 3 months lifecycle for now
  const projectedMonthlyIncome = currentMrr + (3 * settings.setupPrice);
  const monthsToMillion = projectedMonthlyIncome > 0 ? Math.ceil((1000000 - cumulativeEarnings) / projectedMonthlyIncome) : 999;
  
  // Simulator results
  const simNewClientsMonth = Math.round((simDms * 30 * (simResponseRate / 100) * (simCloseRate / 100)));
  const simMrrGain = simNewClientsMonth * settings.retainerPrice;

  return (
    <div className="space-y-16 pb-20 max-w-5xl mx-auto">
      {/* Target Counter */}
      <div className="text-center space-y-4">
        <p className="label-mono">CLIENTES PARA MIAMI</p>
        <div className="relative inline-block">
          <h2 className={cn(
            "text-[120px] lg:text-[180px] font-light leading-none tracking-tighter",
            clientsNeeded === 0 ? "text-vx-forest" : "text-vx-cream"
          )}>
            {clientsNeeded}
          </h2>
          {clientsNeeded === 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-4 -right-12 bg-vx-forest text-[10px] font-mono px-3 py-1 label-mono text-white"
            >
              ✓ META ALCANZADA
            </motion.div>
          )}
        </div>
        <p className="text-xl font-mono text-vx-tobacco">
          {formatNumber(clientsNeeded)} clientes × ${settings.retainerPrice} = {formatCurrency(clientsNeeded * settings.retainerPrice)} MRR
        </p>
      </div>

      {/* Financial Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1 divide-x divide-vx-border/30 bg-vx-border p-px">
        <div className="bg-vx-black p-8 space-y-6">
          <p className="label-mono flex items-center gap-2">
            <DollarSign size={12} className="text-vx-gold" /> LO QUE TIENES
          </p>
          <div className="space-y-2">
            <p className="text-3xl font-serif text-vx-gold">{formatCurrency(currentMrr)}</p>
            <p className="label-mono text-[8px]">MRR ACTUAL</p>
          </div>
          <div className="space-y-2">
            <p className="text-xl font-mono text-vx-parchment">${formatNumber(setupFeesThisMonth)}</p>
            <p className="label-mono text-[8px]">SETUPS ESTE MES</p>
          </div>
        </div>

        <div className="bg-vx-black p-8 space-y-6">
          <p className="label-mono flex items-center gap-2">
            <Target size={12} className="text-vx-amber" /> LO QUE NECESITAS
          </p>
          <div className="space-y-2">
            <p className="text-3xl font-serif text-vx-amber">{formatCurrency(settings.miamiLifeCost)}</p>
            <p className="label-mono text-[8px]">COSTO VIDA MIAMI</p>
          </div>
          <div className="space-y-2">
            <p className={cn(
              "text-3xl font-serif",
              gap <= 0 ? "text-vx-forest" : "text-vx-burgundy"
            )}>
               {gap <= 0 ? formatCurrency(0) : formatCurrency(gap)}
            </p>
            <p className="label-mono text-[8px]">DIFERENCIA</p>
          </div>
        </div>

        <div className="bg-vx-black p-8 space-y-6">
          <p className="label-mono flex items-center gap-2">
            <Calendar size={12} className="text-vx-gold" /> CUÁNDO LLEGAS
          </p>
          <div className="space-y-2">
            <p className="text-3xl font-serif text-vx-cream">
              {clientsNeeded > 0 ? `en ${monthsToGoal} meses` : 'MAÑANA'}
            </p>
            <p className="label-mono text-[8px]">TIEMPO ESTIMADO</p>
          </div>
          <p className="text-xs font-mono text-vx-gold uppercase tracking-widest">{estimatedDate.toUpperCase()}</p>
        </div>
      </div>

      {/* Simulator Sliders */}
      <div className="vx-card space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="label-mono text-vx-gold border-l border-vx-gold pl-4">Simulador de Realidad</h3>
          <p className="text-[10px] font-mono text-vx-tobacco uppercase">Ajusta los sliders para proyectar tu futuro</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-12">
            {/* DM Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center label-mono">
                <span>DMs DIARIOS</span>
                <span className="text-vx-cream">{simDms}</span>
              </div>
              <input 
                type="range" min="20" max="60" value={simDms}
                onChange={(e) => setSimDms(Number(e.target.value))}
                className="w-full accent-vx-gold bg-vx-border appearance-none h-0.5"
              />
            </div>

            {/* Response Rate Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center label-mono">
                <span>TASA DE RESPUESTA %</span>
                <span className="text-vx-cream">{simResponseRate}%</span>
              </div>
              <input 
                type="range" min="10" max="50" value={simResponseRate}
                onChange={(e) => setSimResponseRate(Number(e.target.value))}
                className="w-full accent-vx-gold bg-vx-border appearance-none h-0.5"
              />
            </div>

            {/* Close Rate Slider */}
            <div className="space-y-4">
              <div className="flex justify-between items-center label-mono">
                <span>TASA DE CIERRE %</span>
                <span className="text-vx-cream">{simCloseRate}%</span>
              </div>
              <input 
                type="range" min="5" max="30" value={simCloseRate}
                onChange={(e) => setSimCloseRate(Number(e.target.value))}
                className="w-full accent-vx-gold bg-vx-border appearance-none h-0.5"
              />
            </div>
          </div>

          <div className="bg-vx-black/30 border border-vx-border p-8 flex flex-col justify-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp size={120} />
            </div>
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-mono text-vx-tobacco">NUEVOS CLIENTES / MES</p>
              <h4 className="text-6xl font-serif text-vx-gold">+{simNewClientsMonth}</h4>
            </div>
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-mono text-vx-tobacco">PROGRESO DE MRR / MES</p>
              <h4 className="text-4xl font-serif text-vx-cream">+{formatCurrency(simMrrGain)}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Projection to Million */}
      <div className="space-y-6">
        <h3 className="label-mono">Proyección hacia el Millón</h3>
        <div className="vx-card p-10 h-32 relative flex items-center bg-vx-black border-vx-border/30 overflow-hidden">
          {/* Timeline SVG */}
          <svg className="absolute inset-0 w-full h-full">
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1E1A14" strokeWidth="1" />
            <motion.line 
              initial={{ x2: 0 }}
              animate={{ x2: `${Math.min(100, (cumulativeEarnings / 1000000) * 100)}%` }}
              x1="0" y1="50%" y2="50%" stroke="#B8963E" strokeWidth="2" 
            />
          </svg>

          <div className="relative w-full h-full flex items-center justify-between z-10">
            <div className="text-center group cursor-help">
              <div className="w-3 h-3 bg-vx-gold rounded-full mb-2 mx-auto" />
              <p className="text-[9px] font-mono text-vx-gold">HOY</p>
            </div>
            <div className="text-center opacity-30">
              <div className="w-2 h-2 bg-vx-tobacco rounded-full mb-2 mx-auto" />
              <p className="text-[9px] font-mono text-vx-tobacco">$500K</p>
            </div>
            <div className="text-center">
              <div className={cn(
                "w-4 h-4 border-2 mb-2 mx-auto",
                cumulativeEarnings >= 1000000 ? "bg-vx-gold border-vx-gold" : "border-vx-border bg-vx-black"
              )} />
              <p className="text-[10px] font-mono text-vx-cream">$1.000.000</p>
            </div>
          </div>
        </div>
        <p className="text-right text-[10px] font-mono text-vx-tobacco uppercase tracking-widest leading-loose">
          A este ritmo, alcanzas el millón de dólares acumulado en <span className="text-vx-gold">{monthsToMillion} meses</span>.
        </p>
      </div>
    </div>
  );
}
