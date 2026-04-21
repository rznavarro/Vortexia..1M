import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ConfiguracionSistema } from '../../types';
import { Target, DollarSign, Users, MapPin } from 'lucide-react';

interface OnboardingAdvancedProps {
  onComplete: (config: ConfiguracionSistema) => void;
}

export function OnboardingAdvanced({ onComplete }: OnboardingAdvancedProps) {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Partial<ConfiguracionSistema>>({
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
    costoVidaMiami: 8000
  });

  const handleComplete = () => {
    onComplete({
      ...config,
      id: '',
      createdAt: Date.now(),
      updatedAt: Date.now()
    } as ConfiguracionSistema);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-vx-black flex items-center justify-center p-8">
      <div className="scanline" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="vx-card max-w-2xl w-full space-y-8"
      >
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-serif text-vx-gold">
            VORTEXIA MILLÓN
          </h1>
          <p className="label-mono text-vx-tobacco">
            CONFIGURACIÓN INICIAL DEL SISTEMA
          </p>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= step ? 'bg-vx-gold' : 'bg-vx-border'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Objetivo Financiero */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <Target className="mx-auto text-vx-gold" size={32} />
              <h2 className="text-2xl font-serif text-vx-cream">Objetivo del Millón</h2>
              <p className="text-sm text-vx-tobacco">
                Define tu meta financiera anual y los precios de tus servicios
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label-mono">Objetivo Anual (USD)</label>
                <input
                  type="number"
                  value={config.objetivoAnual}
                  onChange={(e) => setConfig({...config, objetivoAnual: Number(e.target.value)})}
                  className="vx-input text-2xl font-serif"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Precio Setup (USD)</label>
                <input
                  type="number"
                  value={config.precioSetup}
                  onChange={(e) => setConfig({...config, precioSetup: Number(e.target.value)})}
                  className="vx-input text-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Retainer Mensual (USD)</label>
                <input
                  type="number"
                  value={config.precioRetainerMensual}
                  onChange={(e) => setConfig({...config, precioRetainerMensual: Number(e.target.value)})}
                  className="vx-input text-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Clientes Necesarios</label>
                <input
                  type="number"
                  value={config.clientesNecesariosMiami}
                  onChange={(e) => setConfig({...config, clientesNecesariosMiami: Number(e.target.value)})}
                  className="vx-input text-xl"
                  readOnly
                />
              </div>
            </div>

            <div className="bg-vx-gold/10 border border-vx-gold/30 p-4 space-y-2">
              <p className="text-xs font-mono text-vx-gold">CÁLCULO AUTOMÁTICO:</p>
              <p className="text-sm text-vx-cream">
                Objetivo Mensual: ${((config.objetivoAnual || 0) / 12).toLocaleString()}
              </p>
              <p className="text-sm text-vx-cream">
                Objetivo Diario: ${((config.objetivoAnual || 0) / 365).toLocaleString()}
              </p>
            </div>

            <button onClick={nextStep} className="vx-btn-primary w-full">
              CONTINUAR
            </button>
          </motion.div>
        )}

        {/* Step 2: Metas Operativas */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <Users className="mx-auto text-vx-gold" size={32} />
              <h2 className="text-2xl font-serif text-vx-cream">Metas Operativas</h2>
              <p className="text-sm text-vx-tobacco">
                Define tus objetivos diarios de prospección y ventas
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="label-mono">DMs Diarios</label>
                <input
                  type="number"
                  value={config.metaDmsdiarios}
                  onChange={(e) => setConfig({...config, metaDmsdiarios: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Respuestas Esperadas</label>
                <input
                  type="number"
                  value={config.metaRespuestasDiarias}
                  onChange={(e) => setConfig({...config, metaRespuestasDiarias: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Citas Diarias</label>
                <input
                  type="number"
                  value={config.metaCitasDiarias}
                  onChange={(e) => setConfig({...config, metaCitasDiarias: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
              <div className="space-y-2">
                <label className="label-mono">Ventas Diarias</label>
                <input
                  type="number"
                  value={config.metaVentasDiarias}
                  onChange={(e) => setConfig({...config, metaVentasDiarias: Number(e.target.value)})}
                  className="vx-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="label-mono">Alerta de Seguimiento (Horas)</label>
              <input
                type="number"
                value={config.horasAlertaSeguimiento}
                onChange={(e) => setConfig({...config, horasAlertaSeguimiento: Number(e.target.value)})}
                className="vx-input"
              />
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="vx-btn-secondary flex-1">
                ANTERIOR
              </button>
              <button onClick={nextStep} className="vx-btn-primary flex-1">
                CONTINUAR
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Configuración Miami */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <MapPin className="mx-auto text-vx-gold" size={32} />
              <h2 className="text-2xl font-serif text-vx-cream">Objetivo Miami</h2>
              <p className="text-sm text-vx-tobacco">
                Configura tu meta de mudanza a Miami
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="label-mono">Costo de Vida Mensual Miami (USD)</label>
                <input
                  type="number"
                  value={config.costoVidaMiami}
                  onChange={(e) => setConfig({...config, costoVidaMiami: Number(e.target.value)})}
                  className="vx-input text-xl"
                />
              </div>
            </div>

            <div className="bg-vx-forest/20 border border-vx-forest p-6 space-y-4">
              <h3 className="font-serif text-lg text-vx-cream">Resumen del Sistema</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="label-mono">OBJETIVO ANUAL</p>
                  <p className="text-vx-gold font-serif text-xl">
                    ${config.objetivoAnual?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="label-mono">CLIENTES NECESARIOS</p>
                  <p className="text-vx-gold font-serif text-xl">
                    {config.clientesNecesariosMiami}
                  </p>
                </div>
                <div>
                  <p className="label-mono">DMS DIARIOS</p>
                  <p className="text-vx-cream">{config.metaDmsdiarios}</p>
                </div>
                <div>
                  <p className="label-mono">VENTAS DIARIAS</p>
                  <p className="text-vx-cream">{config.metaVentasDiarias}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={prevStep} className="vx-btn-secondary flex-1">
                ANTERIOR
              </button>
              <button onClick={handleComplete} className="vx-btn-primary flex-1">
                INICIALIZAR VORTEXIA MILLÓN
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}