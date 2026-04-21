import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { storageService } from '../../services/storageService';
import { LeadStatus, Lead } from '../../types';
import { cn, extractInstagramHandle } from '../../lib/utils';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const statusOptions: LeadStatus[] = [
  'ENVIÉ DM',
  'RESPONDIÓ',
  'AGENDÓ CITA',
  'NO RESPONDIÓ',
  'INTERESADO',
  'NO INTERESADO'
];

export function QuickAddModal({ isOpen, onClose, onSuccess }: QuickAddModalProps) {
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<LeadStatus>('ENVIÉ DM');
  const [notes, setNotes] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const cleanHandle = extractInstagramHandle(handle);
      // Check if handle exists
      const existing = storageService.getLeads().find(l => extractInstagramHandle(l.handle) === cleanHandle);
      if (existing && cleanHandle.length > 2) {
        setName(existing.name);
        setStatus(existing.status);
      }
    }
  }, [isOpen, handle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle) return;

    const cleanHandle = extractInstagramHandle(handle);
    const finalHandle = `@${cleanHandle}`;

    const newLead: Lead = {
      id: Date.now().toString(),
      handle: finalHandle,
      name: name || cleanHandle,
      status,
      lastInteractionAt: Date.now(),
      notes,
      createdAt: Date.now()
    };

    storageService.addLead(newLead);
    onSuccess();
    reset();
  };

  const reset = () => {
    setHandle('');
    setName('');
    setStatus('ENVIÉ DM');
    setNotes('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[60]">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-vx-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="vx-card w-full max-w-md relative z-[70] space-y-8"
          >
            <div className="flex justify-between items-center">
              <h2 className="label-mono">Registro Rápido</h2>
              <button onClick={onClose} className="text-vx-tobacco hover:text-vx-cream transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="label-mono">URL de Perfil o Handle</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="vx-input"
                  placeholder="https://instagram.com/usuario"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="label-mono">Nombre</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="vx-input"
                  placeholder="Nombre del Realtor"
                />
              </div>

              <div className="space-y-2">
                <label className="label-mono">¿Qué pasó?</label>
                <div className="grid grid-cols-2 gap-2">
                  {statusOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setStatus(opt)}
                      className={cn(
                        "py-2 px-3 text-[10px] font-mono border transition-all duration-200",
                        status === opt 
                          ? "bg-vx-gold text-vx-black border-vx-gold" 
                          : "bg-vx-raised text-vx-tobacco border-vx-border hover:border-vx-tobacco"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-mono">Nota rápida (opcional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="vx-input"
                  placeholder="Lo que dijo..."
                />
              </div>

              <button type="submit" className="vx-btn-primary w-full">
                Registrar
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
