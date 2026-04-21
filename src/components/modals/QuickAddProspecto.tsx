import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles } from 'lucide-react';
import { openaiService } from '../../services/openaiService';
import { EstadoInteres, EstadoRespuesta, Prospecto } from '../../types';
import { cn, extractInstagramHandle } from '../../lib/utils';

interface QuickAddProspectoProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  dataService: any; // Servicio dinámico (Supabase o localStorage)
}

const estadosInteres: EstadoInteres[] = [
  'Muy interesado',
  'Interesado', 
  'Pendiente analizar',
  'No interesado',
  'Frío'
];

const estadosRespuesta: EstadoRespuesta[] = [
  'Respondió',
  'No respondió',
  'Pendiente'
];

export function QuickAddProspecto({ isOpen, onClose, onSuccess, dataService }: QuickAddProspectoProps) {
  const [handle, setHandle] = useState('');
  const [nombre, setNombre] = useState('');
  const [estadoInteres, setEstadoInteres] = useState<EstadoInteres>('Pendiente analizar');
  const [estadoRespuesta, setEstadoRespuesta] = useState<EstadoRespuesta>('Pendiente');
  const [notas, setNotas] = useState('');
  const [analisisIA, setAnalisisIA] = useState('');
  const [analizando, setAnalizando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      
      const checkExisting = async () => {
        const cleanHandle = extractInstagramHandle(handle);
        if (cleanHandle.length > 2) {
          const prospectos = await dataService.getProspectos();
          const existing = prospectos.find(p => extractInstagramHandle(p.handleInstagram) === cleanHandle);
          if (existing) {
            setNombre(existing.nombreProspecto);
            setEstadoInteres(existing.estadoInteres);
            setEstadoRespuesta(existing.estadoRespuesta);
          }
        }
      };
      
      checkExisting();
    }
  }, [isOpen, handle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle || !nombre) return;

    const cleanHandle = extractInstagramHandle(handle);
    const finalHandle = `@${cleanHandle}`;

    const newProspecto: Omit<Prospecto, 'id' | 'createdAt' | 'updatedAt'> = {
      nombreProspecto: nombre,
      urlPerfilInstagram: `https://instagram.com/${cleanHandle}`,
      urlChatDirecto: `https://ig.me/m/${cleanHandle}`,
      handleInstagram: finalHandle,
      estadoInteres,
      estadoRespuesta,
      estadoCita: 'Sin cita',
      estadoAsistencia: 'Sin asistencia',
      estadoCompra: 'No ha comprado',
      notasProspecto: notas,
      fechaUltimaInteraccion: Date.now(),
      fechaPrimerContacto: Date.now()
    };

    const success = await dataService.addProspecto(newProspecto);
    if (success) {
      onSuccess();
      reset();
    } else {
      alert('Error al guardar el prospecto');
    }
  };

  const reset = () => {
    setHandle('');
    setNombre('');
    setEstadoInteres('Pendiente analizar');
    setEstadoRespuesta('Pendiente');
    setNotas('');
    setAnalisisIA('');
  };

  const analizarConIA = async () => {
    if (!nombre) return;
    
    setAnalizando(true);
    try {
      const analisis = await openaiService.analizarProspecto(nombre, '', notas);
      setAnalisisIA(analisis);
    } catch (error) {
      console.error('Error en análisis IA:', error);
    } finally {
      setAnalizando(false);
    }
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
              <h2 className="label-mono">Nuevo Prospecto</h2>
              <button onClick={onClose} className="text-vx-tobacco hover:text-vx-cream transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="label-mono">Handle de Instagram</label>
                <input
                  ref={inputRef}
                  type="text"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="vx-input"
                  placeholder="@usuario o https://instagram.com/usuario"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="label-mono">Nombre del Prospecto</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="vx-input"
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="label-mono">Estado de Interés</label>
                <div className="grid grid-cols-2 gap-2">
                  {estadosInteres.map((estado) => (
                    <button
                      key={estado}
                      type="button"
                      onClick={() => setEstadoInteres(estado)}
                      className={cn(
                        "py-2 px-3 text-[10px] font-mono border transition-all duration-200",
                        estadoInteres === estado 
                          ? "bg-vx-gold text-vx-black border-vx-gold" 
                          : "bg-vx-raised text-vx-tobacco border-vx-border hover:border-vx-tobacco"
                      )}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="label-mono">Estado de Respuesta</label>
                <div className="grid grid-cols-3 gap-2">
                  {estadosRespuesta.map((estado) => (
                    <button
                      key={estado}
                      type="button"
                      onClick={() => setEstadoRespuesta(estado)}
                      className={cn(
                        "py-2 px-3 text-[10px] font-mono border transition-all duration-200",
                        estadoRespuesta === estado 
                          ? "bg-vx-gold text-vx-black border-vx-gold" 
                          : "bg-vx-raised text-vx-tobacco border-vx-border hover:border-vx-tobacco"
                      )}
                    >
                      {estado}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="label-mono">Notas (opcional)</label>
                  <button
                    type="button"
                    onClick={analizarConIA}
                    disabled={!nombre || analizando}
                    className="flex items-center gap-1 text-[9px] font-mono text-vx-gold hover:text-vx-amber transition-colors disabled:opacity-50"
                  >
                    <Sparkles size={12} className={analizando ? 'animate-spin' : ''} />
                    {analizando ? 'ANALIZANDO...' : 'ANÁLISIS IA'}
                  </button>
                </div>
                <textarea
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  className="vx-input min-h-[80px] resize-none"
                  placeholder="Observaciones del prospecto..."
                />
                {analisisIA && (
                  <div className="mt-2 p-3 bg-vx-raised border border-vx-border">
                    <div className="label-mono text-vx-gold mb-2">ANÁLISIS IA:</div>
                    <div className="text-[11px] text-vx-cream leading-relaxed">{analisisIA}</div>
                  </div>
                )}
              </div>

              <button type="submit" className="vx-btn-primary w-full">
                REGISTRAR PROSPECTO
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}