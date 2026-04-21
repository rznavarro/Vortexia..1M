import React, { useState } from 'react';
import { UserSettings, Lead } from '../../types';
import { storageService } from '../../services/storageService';
import { Save, Download, Key, Target, DollarSign, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface ConfigProps {
  settings: UserSettings;
  onRefresh: () => void;
}

export function Config({ settings, onRefresh }: ConfigProps) {
  const [form, setForm] = useState<UserSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    storageService.saveSettings(form);
    setIsSaved(true);
    onRefresh();
    setTimeout(() => setIsSaved(false), 2000);
  };

  const exportLeads = () => {
    const leads = storageService.getLeads();
    if (leads.length === 0) return alert('No hay leads para exportar.');

    const headers = ['Handle', 'Nombre', 'Estado', 'Último Contacto', 'Especialidad', 'Ubicación', 'Valor Estimado', 'Notas'];
    const rows = leads.map(l => [
      l.handle,
      l.name,
      l.status,
      new Date(l.lastInteractionAt).toLocaleDateString(),
      l.specialty || '',
      l.location || '',
      l.estimatedValue || 0,
      l.notes || ''
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `vortexia_leads_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-4xl space-y-12 pb-20">
      <div className="space-y-1">
        <h2 className="text-4xl text-vx-cream tracking-tight font-serif">Configuración del Sistema</h2>
        <p className="label-mono text-vx-tobacco">Parametrización Estratégica</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* API Section */}
        <div className="space-y-8">
          <div className="vx-card space-y-6">
            <h3 className="label-mono flex items-center gap-2 border-b border-vx-border pb-4">
              <Key size={14} className="text-vx-gold" /> Inteligencia Artificial
            </h3>
            <div className="space-y-4">
              <p className="text-[10px] text-vx-tobacco leading-relaxed">
                Vortexia utiliza Gemini de Google para el análisis de pipeline y generación de preguntas. La clave se gestiona a través del panel de secretos de AI Studio.
              </p>
              <div className="bg-vx-gold/10 border border-vx-gold/30 p-3 flex items-center justify-between">
                <span className="text-[10px] font-mono text-vx-cream">ESTADO: CONECTADO</span>
                <span className="w-2 h-2 bg-vx-forest rounded-full" />
              </div>
            </div>
          </div>

          <div className="vx-card space-y-6">
            <h3 className="label-mono flex items-center gap-2 border-b border-vx-border pb-4">
              <Target size={14} className="text-vx-amber" /> Objetivos Operativos
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="label-mono">DMs Diarios (Meta)</label>
                <input 
                  type="number"
                  value={form.dailyDmGoal}
                  onChange={(e) => setForm({...form, dailyDmGoal: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Alerta de Seguimiento (Horas)</label>
                <input 
                  type="number"
                  value={form.followUpAlertHours}
                  onChange={(e) => setForm({...form, followUpAlertHours: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Section */}
        <div className="space-y-8">
          <div className="vx-card space-y-6">
            <h3 className="label-mono flex items-center gap-2 border-b border-vx-border pb-4">
              <DollarSign size={14} className="text-vx-gold" /> Estructura de Precios
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="label-mono">Setup Fee (USD)</label>
                  <input 
                    type="number"
                    value={form.setupPrice}
                    onChange={(e) => setForm({...form, setupPrice: Number(e.target.value)})}
                    className="vx-input text-xl font-serif"
                  />
                </div>
                <div className="space-y-2">
                  <label className="label-mono">Retainer Mensual (USD)</label>
                  <input 
                    type="number"
                    value={form.retainerPrice}
                    onChange={(e) => setForm({...form, retainerPrice: Number(e.target.value)})}
                    className="vx-input text-xl font-serif"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="vx-card space-y-6">
            <h3 className="label-mono flex items-center gap-2 border-b border-vx-border pb-4">
              <DollarSign size={14} className="text-vx-amber" /> Meta Miami
            </h3>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="label-mono">Clientes activos necesarios</label>
                <input 
                  type="number"
                  value={form.miamiGoalClients}
                  onChange={(e) => setForm({...form, miamiGoalClients: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Costo de vida mensual Miami</label>
                <input 
                  type="number"
                  value={form.miamiLifeCost}
                  onChange={(e) => setForm({...form, miamiLifeCost: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-6 border-t border-vx-border flex flex-col md:flex-row gap-6">
        <button 
          onClick={handleSave}
          className="vx-btn-primary flex-1 flex items-center justify-center gap-3"
        >
          {isSaved ? "✓ CONFIGURACIÓN GUARDADA" : "GUARDAR CAMBIOS"}
          {!isSaved && <Save size={18} />}
        </button>
        <button 
          onClick={exportLeads}
          className="vx-btn-secondary md:w-auto flex items-center justify-center gap-3"
        >
          EXPORTAR LEADS A CSV
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}
