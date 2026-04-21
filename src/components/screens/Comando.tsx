import React, { useMemo } from 'react';
import { Lead, UserSettings } from '../../types';
import { formatCurrency, formatNumber, cn } from '../../lib/utils';
import { motion } from 'motion/react';
import { AlertCircle, Clock, TrendingUp, Users } from 'lucide-react';

interface ComandoProps {
  leads: Lead[];
  settings: UserSettings;
  onQuickAdd: () => void;
}

export function Comando({ leads, settings, onQuickAdd }: ComandoProps) {
  const stats = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const dmsToday = leads.filter(l => l.createdAt >= today).length;
    
    const activeClients = leads.filter(l => l.status === 'CERRADOS').length;
    const mrr = activeClients * settings.retainerPrice;
    
    const threshold = Date.now() - (settings.followUpAlertHours * 60 * 60 * 1000);
    const urgentLeads = leads.filter(l => 
      l.status !== 'CERRADOS' && 
      l.status !== 'PERDIDOS' && 
      l.lastInteractionAt < threshold
    );

    const miamiProgress = Math.min(100, (activeClients / settings.miamiGoalClients) * 100);

    return {
      mrr,
      activeClients,
      dmsToday,
      urgentCount: urgentLeads.length,
      urgentLeads,
      miamiProgress
    };
  }, [leads, settings]);

  const recentActivity = useMemo(() => {
    return [...leads]
      .sort((a, b) => b.lastInteractionAt - a.lastInteractionAt)
      .slice(0, 10);
  }, [leads]);

  const getTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `hace ${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours}h`;
    return `hace ${Math.floor(hours / 24)}d`;
  };

  return (
    <div className="space-y-12 pb-20">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* MRR */}
        <div className="vx-card flex flex-col justify-between">
          <p className="label-mono">MRR ACTIVO</p>
          <h2 className="text-6xl font-light text-vx-cream mt-2">
            <span className="text-vx-gold">$</span>{formatNumber(stats.mrr)}
          </h2>
          <p className="label-mono mt-4 font-normal lowercase tracking-normal">
            {stats.activeClients} clientes × ${settings.retainerPrice}
          </p>
        </div>

        {/* DMs Today */}
        <div className="vx-card cursor-pointer group" onClick={onQuickAdd}>
          <p className="label-mono">DMs HOY</p>
          <h2 className="text-6xl font-light text-vx-cream mt-2 tracking-tighter">
            {stats.dmsToday}<span className="text-vx-tobacco text-3xl"> / {settings.dailyDmGoal}</span>
          </h2>
          <div className="progress-track mt-6">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (stats.dmsToday / settings.dailyDmGoal) * 100)}%` }}
              className={cn(
                "progress-fill",
                stats.dmsToday < 20 ? "bg-vx-burgundy" : 
                stats.dmsToday < 35 ? "bg-vx-amber" : "bg-vx-forest"
              )}
            />
          </div>
        </div>

        {/* Follow Ups */}
        <div className="vx-card">
          <p className="label-mono">SEGUIR HOY</p>
          <h2 className={cn(
            "text-6xl font-light mt-2",
            stats.urgentCount > 0 ? "text-vx-burgundy animate-pulse-urgency" : "text-vx-forest"
          )}>
            {stats.urgentCount}
          </h2>
          <p className="label-mono mt-4 font-normal lowercase tracking-normal">
            {stats.urgentCount > 0 ? "Leads enfriándose" : "Pipeline al día"}
          </p>
        </div>

        {/* Miami Goal */}
        <div className="vx-card flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="label-mono">HACIA MIAMI</p>
            <h2 className="text-6xl font-light text-vx-gold mt-2">
              {Math.round(stats.miamiProgress)}%
            </h2>
          </div>
          
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="40" cy="40" r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                className="text-vx-border"
              />
              <motion.circle
                cx="40" cy="40" r="36"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={226}
                initial={{ strokeDashoffset: 226 }}
                animate={{ strokeDashoffset: 226 - (226 * stats.miamiProgress) / 100 }}
                className="text-vx-gold"
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Removed local banner since it's global now */}

      {/* Activity + Mini Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h3 className="label-mono border-b border-vx-border pb-2">Actividad Reciente</h3>
          <div className="divide-y divide-vx-border/30">
            {recentActivity.length > 0 ? recentActivity.map((lead) => (
              <div key={lead.id} className="py-4 flex items-center justify-between hover:bg-vx-gold/5 transition-colors group px-2 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-sm font-mono text-vx-cream group-hover:text-vx-gold transition-all">{lead.handle}</span>
                    <span className="text-[10px] text-vx-tobacco uppercase tracking-widest">{lead.name}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={cn(
                    "text-[9px] font-mono px-2 py-0.5 border uppercase tracking-widest",
                    lead.status === 'CERRADOS' ? "border-vx-forest text-vx-forest bg-vx-forest/5" :
                    lead.status === 'ENVIÉ DM' ? "border-vx-tobacco text-vx-tobacco" :
                    "border-vx-amber text-vx-amber bg-vx-amber/5"
                  )}>
                    {lead.status}
                  </span>
                  <span className="text-[9px] font-mono text-vx-tobacco mt-1 uppercase">
                    {getTimeAgo(lead.lastInteractionAt)}
                  </span>
                </div>
              </div>
            )) : (
              <div className="p-12 text-center text-vx-tobacco font-mono text-xs">
                Sin actividad registrada.
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="label-mono">Progreso Semanal</h3>
          <div className="vx-card space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-vx-gold" />
                <p className="text-xs font-mono">Tasa de Respuesta</p>
              </div>
              <p className="text-xl font-serif text-vx-cream">24%</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-vx-amber" />
                <p className="text-xs font-mono">Tiempo de Cierre</p>
              </div>
              <p className="text-xl font-serif text-vx-cream">12 días</p>
            </div>
            
            <div className="pt-6 border-t border-vx-border">
              <button 
                onClick={onQuickAdd}
                className="vx-btn-secondary w-full text-[10px]"
              >
                Registrar Nuevo DM
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
