import React, { useState, useMemo } from 'react';
import { Lead, UserSettings, LeadStatus } from '../../types';
import { supabaseService } from '../../services/supabaseService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Clock, 
  Trash2, 
  ChevronRight, 
  MessageSquare, 
  Instagram 
} from 'lucide-react';
import { 
  cn, 
  formatCurrency, 
  getInstagramChatUrl, 
  getInstagramProfileUrl, 
  extractInstagramHandle 
} from '../../lib/utils';
import { LeadDetails } from './LeadDetails';

interface LeadsProps {
  leads: Lead[];
  settings: UserSettings;
  onRefresh: () => void;
}

const TABS: { id: string; label: string }[] = [
  { id: 'TODOS', label: 'TODOS' },
  { id: 'URGENTES', label: 'URGENTES' },
  { id: 'RESPONDIÓ', label: 'RESPONDIÓ' },
  { id: 'AGENDÓ CITA', label: 'CITAS' },
  { id: 'CERRADOS', label: 'CERRADOS' },
  { id: 'PERDIDOS', label: 'PERDIDOS' },
];

export function Leads({ leads, settings, onRefresh }: LeadsProps) {
  const [activeTab, setActiveTab] = useState('TODOS');
  const [search, setSearch] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch = lead.handle.toLowerCase().includes(search.toLowerCase()) || 
                           lead.name.toLowerCase().includes(search.toLowerCase());
      
      const threshold = Date.now() - (settings.followUpAlertHours * 60 * 60 * 1000);
      const isUrgent = lead.status !== 'CERRADOS' && 
                       lead.status !== 'PERDIDOS' && 
                       lead.lastInteractionAt < threshold;

      if (activeTab === 'URGENTES') return matchesSearch && isUrgent;
      if (activeTab === 'TODOS') return matchesSearch;
      return matchesSearch && lead.status === activeTab;
    }).sort((a, b) => b.lastInteractionAt - a.lastInteractionAt);
  }, [leads, activeTab, search, settings]);

  const getTimeAgo = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  const isLeadUrgent = (lead: Lead) => {
    const threshold = Date.now() - (settings.followUpAlertHours * 60 * 60 * 1000);
    return lead.status !== 'CERRADOS' && 
           lead.status !== 'PERDIDOS' && 
           lead.lastInteractionAt < threshold;
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header & Filter Tabs */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex border-b border-vx-border overflow-x-auto no-scrollbar">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-4 text-[10px] font-mono tracking-widest transition-all relative",
                  activeTab === tab.id ? "text-vx-gold" : "text-vx-tobacco hover:text-vx-cream"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="tab-underline"
                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-vx-gold" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-vx-tobacco group-focus-within:text-vx-gold transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="BUSCAR HANDLE O NOMBRE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-vx-surface border border-vx-border px-10 py-2 text-[10px] font-mono focus:border-vx-gold outline-none w-full md:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="vx-card p-0 overflow-hidden">
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-vx-border bg-vx-black/20">
          <div className="col-span-4 data-col-header border-none py-0">Lead</div>
          <div className="col-span-3 data-col-header border-none py-0">Estado</div>
          <div className="col-span-2 data-col-header border-none py-0">Última Vez</div>
          <div className="col-span-2 data-col-header border-none py-0 text-right">Valor</div>
          <div className="col-span-1 border-none py-0"></div>
        </div>

        <div className="">
          {filteredLeads.length > 0 ? filteredLeads.map((lead) => (
            <motion.div 
              layout
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className="data-grid-row"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="flex flex-col flex-1">
                  <span className="text-sm font-mono text-vx-cream group-hover:text-vx-gold transition-colors">{lead.handle}</span>
                  <span className="text-[10px] text-vx-tobacco">{lead.name}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                    href={getInstagramProfileUrl(extractInstagramHandle(lead.handle))} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 hover:bg-vx-gold/10 text-vx-tobacco hover:text-vx-gold rounded-sm transition-all"
                    title="Ver Perfil"
                  >
                    <Instagram size={14} />
                  </a>
                  <a 
                    href={getInstagramChatUrl(extractInstagramHandle(lead.handle))} 
                    target="_blank" 
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 hover:bg-vx-gold/10 text-vx-tobacco hover:text-vx-gold rounded-sm transition-all"
                    title="Abrir Chat Directo"
                  >
                    <MessageSquare size={14} />
                  </a>
                </div>
              </div>

              <div className="col-span-3 flex items-center gap-2">
                <span className={cn(
                  "text-[9px] font-mono px-2 py-0.5 border uppercase tracking-wider",
                  lead.status === 'CERRADOS' ? "border-vx-forest text-vx-forest" :
                  lead.status === 'PERDIDOS' ? "border-vx-burgundy text-vx-burgundy" :
                  "border-vx-amber text-vx-amber"
                )}>
                  {lead.status}
                </span>
                {isLeadUrgent(lead) && (
                  <span className="text-[8px] font-mono text-vx-burgundy animate-pulse border border-vx-burgundy px-1">URGENTE</span>
                )}
              </div>

              <div className="col-span-2 flex items-center gap-2 text-vx-tobacco">
                <Clock size={12} />
                <span className="text-[11px] font-mono">{getTimeAgo(lead.lastInteractionAt)}</span>
              </div>

              <div className="col-span-2 text-right">
                <span className="text-lg font-serif font-light text-vx-cream">
                  {lead.estimatedValue ? formatCurrency(lead.estimatedValue) : '—'}
                </span>
              </div>

              <div className="col-span-1 text-right flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-vx-tobacco hover:text-vx-gold">
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )) : (
            <div className="p-20 text-center space-y-4">
              <p className="text-vx-tobacco font-mono text-xs">Sin leads registrados en esta sección.</p>
              <button 
                onClick={onRefresh}
                className="vx-btn-ghost text-[9px]"
              >
                Refrescar Datos
              </button>
            </div>
          )}
        </div>
      </div>

      <LeadDetails 
        lead={selectedLead} 
        isOpen={!!selectedLead} 
        onClose={() => setSelectedLead(null)}
        settings={settings}
        onUpdate={async () => {
          onRefresh();
          if (selectedLead) {
            const leads = await supabaseService.getLeads();
            const updated = leads.find(l => l.id === selectedLead.id);
            setSelectedLead(updated || null);
          }
        }}
      />
    </div>
  );
}
