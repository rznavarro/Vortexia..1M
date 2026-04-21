import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lead, UserSettings, LeadStatus } from '../../types';
import { supabaseService } from '../../services/supabaseService';
import { 
  X, 
  Copy, 
  Zap, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  User, 
  MapPin, 
  Briefcase,
  Instagram,
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { 
  cn, 
  formatCurrency, 
  getInstagramChatUrl, 
  getInstagramProfileUrl, 
  extractInstagramHandle 
} from '../../lib/utils';
import { GoogleGenAI } from "@google/genai";

interface LeadDetailsProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdate: () => void;
}

const statusOptions: LeadStatus[] = [
  'ENVIÉ DM', 'RESPONDIÓ', 'AGENDÓ CITA', 'NO RESPONDIÓ', 
  'INTERESADO', 'NO INTERESADO', 'CERRADOS', 'PERDIDOS'
];

export function LeadDetails({ lead, isOpen, onClose, settings, onUpdate }: LeadDetailsProps) {
  const [questions, setQuestions] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState<number | null>(null);

  const handleStatusChange = async (newStatus: LeadStatus) => {
    if (!lead) return;
    const updatedLead = { 
      ...lead, 
      status: newStatus, 
      lastInteractionAt: Date.now() 
    };
    await supabaseService.updateLead(updatedLead);
    onUpdate();
  };

  const handleValueChange = async (val: string) => {
    if (!lead) return;
    const updatedLead = { ...lead, estimatedValue: Number(val) || 0 };
    await supabaseService.updateLead(updatedLead);
    onUpdate();
  };

  const handleDelete = async () => {
    if (!lead || !confirm('¿Eliminar este lead permanentemente?')) return;
    await supabaseService.deleteLead(lead.id);
    onClose();
    onUpdate();
  };

  const generateQuestions = async () => {
    if (!lead) return;
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Perfil: ${lead.handle} - ${lead.name}. Especialidad: ${lead.specialty || 'No especificada'}. Ubicación: ${lead.location || 'Miami'}. Notas: ${lead.notes || 'Ninguna'}.`,
        config: {
          systemInstruction: `Eres un experto en ventas consultivas para el sector inmobiliario. Joaquín vende sistemas de BI y agentes de voz a Realtors. Setup: $500. Retainer: $300/mes.
          Recibirás el perfil de un Realtor potencial. Genera 5 preguntas de calificación altamente específicas para ese perfil. Las preguntas deben:
          — Revelar si tiene el problema que Joaquín resuelve
          — Determinar si tiene el presupuesto ($300/mes)
          — Crear urgencia de forma natural
          — Sonar como conversación, no como interrogatorio
          — Adaptarse a su especialidad y experiencia
          No generes preguntas genéricas. Cada pregunta debe ser específica para ESTE Realtor.
          Formato: lista numerada de 5 items. Sin introducciones. Directo al grano.`,
        }
      });

      const text = response.text || '';
      const lines = text.split('\n')
        .map(l => l.replace(/^\d+\.\s*/, '').trim())
        .filter(l => l.length > 0)
        .slice(0, 5);
      
      setQuestions(lines);
    } catch (err) {
      console.error(err);
      setQuestions(['Error al generar preguntas. Verifica tu conexión.']);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setIsCopied(index);
    setTimeout(() => setIsCopied(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && lead && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-vx-black/60 backdrop-blur-sm z-[80]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-xl bg-vx-surface border-l border-vx-border z-[90] overflow-y-auto no-scrollbar shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-vx-surface p-6 border-b border-vx-border flex justify-between items-start z-10">
              <div className="space-y-1">
                <h2 className="text-3xl font-serif text-vx-cream leading-tight">{lead.name}</h2>
                <div className="flex items-center gap-3">
                  <p className="text-vx-gold font-mono text-sm tracking-widest">{lead.handle}</p>
                  <div className="flex items-center gap-2 border-l border-vx-border pl-3">
                    <a 
                      href={getInstagramProfileUrl(extractInstagramHandle(lead.handle))} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-vx-tobacco hover:text-vx-gold transition-colors flex items-center gap-1.5 label-mono"
                    >
                      <Instagram size={12} /> Perfil
                    </a>
                    <a 
                      href={getInstagramChatUrl(extractInstagramHandle(lead.handle))} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-vx-tobacco hover:text-vx-gold transition-colors flex items-center gap-1.5 label-mono"
                    >
                      <MessageSquare size={12} /> Chat
                    </a>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-vx-tobacco hover:text-vx-cream transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-10">
              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 label-mono text-vx-tobacco">
                    <Briefcase size={12} /> Especialidad
                  </div>
                  <input 
                    className="vx-input" 
                    value={lead.specialty || ''} 
                    placeholder="Ej. Luxury, Rental..."
                    onChange={async (e) => {
                      const updated = { ...lead, specialty: e.target.value };
                      await supabaseService.updateLead(updated);
                      onUpdate();
                    }}
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 label-mono text-vx-tobacco">
                    <MapPin size={12} /> Ubicación
                  </div>
                  <input 
                    className="vx-input" 
                    value={lead.location || ''} 
                    placeholder="Miami, FL..."
                    onChange={async (e) => {
                      const updated = { ...lead, location: e.target.value };
                      await supabaseService.updateLead(updated);
                      onUpdate();
                    }}
                  />
                </div>
              </div>

              {/* Status & Value */}
              <div className="grid grid-cols-2 gap-8 py-6 border-y border-vx-border/30">
                <div className="space-y-4">
                  <p className="label-mono">Estado Actual</p>
                  <select 
                    value={lead.status}
                    onChange={(e) => handleStatusChange(e.target.value as LeadStatus)}
                    className="vx-input cursor-pointer"
                  >
                    {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <p className="label-mono">Valor Estimado</p>
                  <div className="relative">
                    <span className="absolute left-0 bottom-2 text-vx-gold font-serif">$</span>
                    <input 
                      type="number"
                      value={lead.estimatedValue || ''}
                      onChange={(e) => handleValueChange(e.target.value)}
                      className="vx-input pl-4 text-xl"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* AI Questions */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="label-mono">Preguntas de Calificación (IA)</h3>
                  <button 
                    onClick={generateQuestions}
                    disabled={isGenerating}
                    className="vx-btn-secondary text-[9px] py-1.5 px-4 flex items-center gap-2 disabled:opacity-50"
                  >
                    <Zap size={12} className={isGenerating ? "animate-spin text-vx-gold" : "text-vx-gold"} />
                    {isGenerating ? "GENERANDO..." : "GENERAR PREGUNTAS"}
                  </button>
                </div>

                <div className="space-y-3">
                  {questions.length > 0 ? questions.map((q, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      key={i} 
                      className="bg-vx-raised p-4 border border-vx-border rounded-sm group relative"
                    >
                      <p className="text-xs text-vx-parchment leading-relaxed pr-8">{q}</p>
                      <button 
                        onClick={() => copyToClipboard(q, i)}
                        className="absolute right-3 top-4 text-vx-tobacco hover:text-vx-cream transition-colors"
                      >
                        {isCopied === i ? <CheckCircle2 size={16} className="text-vx-forest" /> : <Copy size={16} />}
                      </button>
                    </motion.div>
                  )) : (
                    <div className="h-32 flex items-center justify-center border border-dashed border-vx-border rounded-sm bg-vx-black/20">
                      <p className="text-[10px] font-mono text-vx-tobacco text-center px-10">
                        Presiona el botón superior para que Vortexia IA genere preguntas estratégicas basadas en el perfil de este Realtor.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-10 flex border-t border-vx-border gap-4">
                <button 
                  onClick={() => handleStatusChange('CERRADOS')}
                  className="vx-btn-primary flex-1 text-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={18} /> MARCAR COMO CERRADO
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-3 border border-vx-burgundy text-vx-burgundy hover:bg-vx-burgundy hover:text-vx-cream transition-all rounded-sm"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
