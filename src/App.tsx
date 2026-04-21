import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar, TabId } from './components/layout/Sidebar';
import { supabaseAdvancedService } from './services/supabaseAdvancedService';
import { Prospecto, ConfiguracionSistema } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Plus } from 'lucide-react';

// Screens
import { ComandoAdvanced } from './components/screens/ComandoAdvanced';
import { Leads } from './components/screens/Leads';
import { Pipeline } from './components/screens/Pipeline';
import { Miami } from './components/screens/Miami';
import { Config } from './components/screens/Config';
import { OnboardingAdvanced } from './components/screens/OnboardingAdvanced';
import { QuickAddProspecto } from './components/modals/QuickAddProspecto';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('comando');
  const [prospectos, setProspectos] = useState<Prospecto[]>([]);
  const [configuracion, setConfiguracion] = useState<ConfiguracionSistema>({
    id: '',
    objetivoAnual: 1000000,
    objetivoMensual: 83333.33,
    objetivoDiario: 2740,
    precioSetup: 500,
    precioRetainerMensual: 300,
    metaDmsdiarios: 40,
    metaRespuestasDiarias: 8,
    metaCitasDiarias: 2,
    metaVentasDiarias: 1,
    horasAlertaSeguimiento: 48,
    clientesNecesariosMiami: 278,
    costoVidaMiami: 8000,
    createdAt: Date.now(),
    updatedAt: Date.now()
  });
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [useSupabase, setUseSupabase] = useState(true);

  // Servicio dinámico basado en disponibilidad
  const dataService = useSupabase ? supabaseAdvancedService : localStorageService;

  useEffect(() => {
    const loadData = async () => {
      try {
        // Intentar conectar con Supabase primero
        const isSupabaseConnected = await supabaseAdvancedService.testConnection();
        
        if (!isSupabaseConnected) {
          console.log('Supabase no disponible, usando localStorage');
          setUseSupabase(false);
        }

        const service = isSupabaseConnected ? supabaseAdvancedService : localStorageService;

        const [prospectosData, configData, initialized] = await Promise.all([
          service.getProspectos(),
          service.getConfiguracion(),
          service.isInitialized()
        ]);
        
        setProspectos(prospectosData);
        setConfiguracion(configData);
        setIsInitialized(initialized);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback a localStorage en caso de error
        setUseSupabase(false);
        const [prospectosData, configData, initialized] = await Promise.all([
          localStorageService.getProspectos(),
          localStorageService.getConfiguracion(),
          localStorageService.isInitialized()
        ]);
        setProspectos(prospectosData);
        setConfiguracion(configData);
        setIsInitialized(initialized);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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

  const refreshData = async () => {
    try {
      const [prospectosData, configData] = await Promise.all([
        dataService.getProspectos(),
        dataService.getConfiguracion()
      ]);
      setProspectos(prospectosData);
      setConfiguracion(configData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const urgentCount = useMemo(() => {
    const threshold = Date.now() - (configuracion.horasAlertaSeguimiento * 60 * 60 * 1000);
    return prospectos.filter(p => 
      p.estadoCompra !== 'Compró' && 
      p.estadoCompra !== 'Compró servicio Vortexia' && 
      p.fechaUltimaInteraccion < threshold
    ).length;
  }, [prospectos, configuracion.horasAlertaSeguimiento]);

  const attentionNeeded = useMemo(() => {
    const today = new Date().setHours(0, 0, 0, 0);
    const dmsToday = prospectos.filter(p => p.fechaPrimerContacto >= today).length;
    return dmsToday < configuracion.metaDmsdiarios && new Date().getHours() >= 12;
  }, [prospectos, configuracion.metaDmsdiarios]);

  if (loading) {
    return (
      <div className="min-h-screen bg-vx-black flex items-center justify-center">
        <div className="text-vx-cream font-mono text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-vx-gold rounded-full animate-pulse"></div>
            Cargando VORTEXIA MILLÓN...
          </div>
          <div className="text-xs text-vx-cream/60 mt-2">
            {useSupabase ? 'Conectando con Supabase' : 'Modo local activo'}
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <OnboardingAdvanced 
        onComplete={async (newConfig) => {
          await dataService.saveConfiguracion(newConfig);
          await dataService.setInitialized();
          setConfiguracion(newConfig);
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
                  {urgentCount} PROSPECTOS LLEVAN MÁS DE {configuracion.horasAlertaSeguimiento}H SIN RESPUESTA
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
              {activeTab === 'comando' && <ComandoAdvanced prospectos={prospectos} configuracion={configuracion} onQuickAdd={() => setIsQuickAddOpen(true)} />}
              {activeTab === 'leads' && <Leads prospectos={prospectos} configuracion={configuracion} onRefresh={refreshData} />}
              {activeTab === 'pipeline' && <Pipeline prospectos={prospectos} configuracion={configuracion} />}
              {activeTab === 'miami' && <Miami prospectos={prospectos} configuracion={configuracion} />}
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

        <QuickAddProspecto 
          isOpen={isQuickAddOpen} 
          onClose={() => setIsQuickAddOpen(false)} 
          onSuccess={() => {
            refreshData();
            setIsQuickAddOpen(false);
          }}
          dataService={dataService}
        />
      </main>
    </div>
  );
}

