import React, { useMemo, useState } from 'react';
import { Lead, UserSettings } from '../../types';
import { motion } from 'motion/react';
import { cn, formatCurrency, formatNumber } from '../../lib/utils';
import { Zap, Activity, Filter, BarChart3, TrendingUp } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface PipelineProps {
  leads: Lead[];
  settings: UserSettings;
}

export function Pipeline({ leads, settings }: PipelineProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');

  const funnelData = useMemo(() => {
    const total = leads.length;
    const responded = leads.filter(l => l.status !== 'ENVIÉ DM' && l.status !== 'NO RESPONDIÓ').length;
    const appointments = leads.filter(l => l.status === 'AGENDÓ CITA' || l.status === 'CALIFICADO' || l.status === 'CITAS' || l.status === 'CERRADOS').length;
    const closed = leads.filter(l => l.status === 'CERRADOS').length;

    const stages = [
      { label: 'CONTACTADOS', count: total, color: 'bg-vx-tobacco' },
      { label: 'RESPONDIERON', count: responded, color: 'bg-vx-amber' },
      { label: 'CITAS', count: appointments, color: 'bg-vx-gold' },
      { label: 'CERRADOS', count: closed, color: 'bg-vx-forest' },
    ];

    return stages;
  }, [leads]);

  const bottleneck = useMemo(() => {
    if (leads.length === 0) return null;
    const total = leads.length;
    const responded = leads.filter(l => l.status !== 'ENVIÉ DM' && l.status !== 'NO RESPONDIÓ').length;
    const appointments = leads.filter(l => l.status === 'AGENDÓ CITA' || l.status === 'CALIFICADO' || l.status === 'CITAS' || l.status === 'CERRADOS').length;
    
    const responseRate = (responded / total) * 100;
    const appointmentRate = (appointments / responded) * 100;

    if (responseRate < 20) {
      return {
        stage: 'Contacto',
        opportunity: 'Paso de Contacto a Respuesta',
        rate: responseRate,
        advice: 'Tasa de respuesta baja. Ajustar el primer DM para generar más curiosidad.'
      };
    }
    if (appointmentRate < 15) {
      return {
        stage: 'Respuesta',
        opportunity: 'Paso de Respuesta a Cita',
        rate: appointmentRate,
        advice: 'Pocas citas agendadas tras respuesta. El script de calificación está fallando.'
      };
    }
    return null;
  }, [leads]);

  const runAiAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Métricas: Total Leads: ${leads.length}. DMs Enviados: ${leads.length}. Respondieron: ${funnelData[1].count}. Citas: ${funnelData[2].count}. Cerrados: ${funnelData[3].count}. MRR Actual: ${funnelData[3].count * settings.retainerPrice}.`,
        config: {
          systemInstruction: `Eres el coach de ventas de un empresario que vende sistemas de BI a Realtors. Setup $500, retainer $300/mes. Meta: $1.000.000 USD.
          Recibirás las métricas de su pipeline este mes. Responde con exactamente 4 bloques:
          [ESTADO] Dónde está el pipeline ahora. Una línea.
          [CUELLO DE BOTELLA] El paso con mayor pérdida de leads con el porcentaje exacto.
          [AJUSTE] Una sola cosa concreta que debe cambiar en su proceso esta semana.
          [PROYECCIÓN] Si mantiene el ritmo actual, cuánto MRR tendrá en 30 y 90 días.
          Directo. Con números. Sin motivación barata.`,
        }
      });
      setAiAnalysis(response.text || 'Sin análisis disponible.');
    } catch (err) {
      setAiAnalysis('Ocurrió un error en el análisis IA.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Activity Graph SVG
  const activityPoints = useMemo(() => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return d.setHours(0,0,0,0);
    });

    return last30Days.map(day => {
      const count = leads.filter(l => {
        const d = new Date(l.createdAt).setHours(0,0,0,0);
        return d === day;
      }).length;
      return count;
    });
  }, [leads]);

  const maxActivity = Math.max(...activityPoints, 10);

  return (
    <div className="space-y-12 pb-20">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-4xl text-vx-cream tracking-tight font-serif">Pipeline de Inteligencia</h2>
          <p className="label-mono text-vx-tobacco">Monitor de Conversión y Embudo</p>
        </div>
        <button 
          onClick={runAiAnalysis}
          disabled={isAnalyzing}
          className="vx-btn-secondary py-2 px-6 flex items-center gap-2 group"
        >
          <Zap size={14} className={cn("text-vx-gold", isAnalyzing && "animate-spin")} />
          {isAnalyzing ? 'ANALIZANDO...' : 'ANALIZAR MI PIPELINE'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Funnel Visual */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            {funnelData.map((stage, i) => {
              const width = Math.max(10, (stage.count / (leads.length || 1)) * 100);
              return (
                <div key={stage.label} className="flex items-center gap-6">
                  <div className="w-24 text-right">
                    <p className="text-3xl font-serif text-vx-cream leading-none">{stage.count}</p>
                    <p className="label-mono text-[8px] mt-1 text-vx-tobacco">{stage.label}</p>
                  </div>
                  <div className="flex-1 h-12 bg-vx-surface border border-vx-border/30 relative flex items-center p-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${width}%` }}
                      className={cn("h-full opacity-80", stage.color)}
                      style={{ opacity: 1 - (i * 0.15) }}
                    />
                    {i > 0 && funnelData[i-1].count > 0 && (
                      <span className="absolute -left-12 top-1/2 -translate-y-1/2 text-[9px] font-mono text-vx-gold">
                        {Math.round((stage.count / funnelData[i-1].count) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottleneck Insight */}
          {bottleneck && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-6 border-l-2 border-vx-gold bg-vx-surface/50"
            >
              <h4 className="label-mono text-vx-gold flex items-center gap-2 mb-2">
                <Filter size={12} /> INSIGHT AUTOMÁTICO
              </h4>
              <p className="text-sm text-vx-parchment leading-relaxed">
                Tu mayor oportunidad: <span className="text-vx-cream">{bottleneck.opportunity}</span>. 
                Solo el {Math.round(bottleneck.rate)}% avanza. {bottleneck.advice}
              </p>
            </motion.div>
          )}

          {aiAnalysis && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="vx-card bg-vx-gold/5 border-vx-gold/20"
            >
              <div className="flex items-center gap-2 label-mono text-vx-gold mb-6 border-b border-vx-gold/10 pb-2">
                <TrendingUp size={14} /> COACH ESTRATÉGICO
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {aiAnalysis.split('[').filter(x => x).map(block => {
                  const [title, ...content] = block.split(']');
                  return (
                    <div key={title} className="space-y-1">
                      <p className="label-mono text-vx-tobacco text-[8px]">{title}</p>
                      <p className="text-xs text-vx-parchment font-mono">{content.join(']').trim()}</p>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Activity Chart */}
        <div className="space-y-10">
          <div className="space-y-4">
            <h3 className="label-mono">Actividad 30 Días</h3>
            <div className="vx-card p-4 h-48 flex items-end justify-between gap-1">
              {activityPoints.map((val, i) => {
                const height = (val / maxActivity) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col h-full justify-end group relative">
                    <div 
                      className={cn(
                        "w-full bg-vx-tobacco hover:bg-vx-gold transition-colors",
                        val > 0 ? "opacity-100" : "opacity-20"
                      )}
                      style={{ height: `${Math.max(2, height)}%` }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-vx-raised text-vx-cream text-[8px] px-1 py-0.5 rounded-xs opacity-0 group-hover:opacity-100 pointer-events-none border border-vx-border z-10">
                      {val}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[8px] label-mono">
              <span>HACE 30 DÍAS</span>
              <span>HOY</span>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="label-mono">Conversión</h3>
            <div className="vx-card p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-vx-tobacco">DMs ENVIADOS TOTAL</span>
                <span className="text-2xl font-serif">{formatNumber(leads.length)}</span>
              </div>
              <div className="flex justify-between items-center text-vx-gold">
                <span className="text-[10px] font-mono">TASA DE CIERRE</span>
                <span className="text-2xl font-serif">
                  {leads.length > 0 ? Math.round((funnelData[3].count / leads.length) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
