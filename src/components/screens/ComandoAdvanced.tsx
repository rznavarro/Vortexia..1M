import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Prospecto, ConfiguracionSistema } from '../../types';
import { 
  Target, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  Phone,
  CheckCircle2,
  Plus
} from 'lucide-react';

interface ComandoAdvancedProps {
  prospectos: Prospecto[];
  configuracion: ConfiguracionSistema;
  onQuickAdd: () => void;
}

export function ComandoAdvanced({ prospectos, configuracion, onQuickAdd }: ComandoAdvancedProps) {
  // Cálculos de métricas
  const metricas = useMemo(() => {
    const hoy = new Date().setHours(0, 0, 0, 0);
    const esteMes = new Date().getMonth();
    const esteAno = new Date().getFullYear();

    // Prospectos de hoy
    const prospectosHoy = prospectos.filter(p => p.fechaPrimerContacto >= hoy);
    
    // Prospectos del mes
    const prospectosMes = prospectos.filter(p => {
      const fecha = new Date(p.fechaPrimerContacto);
      return fecha.getMonth() === esteMes && fecha.getFullYear() === esteAno;
    });

    // Estados del embudo
    const respondieron = prospectos.filter(p => p.estadoRespuesta === 'Respondió').length;
    const citasAgendadas = prospectos.filter(p => p.estadoCita === 'Cita agendada' || p.estadoCita === 'Cita realizada').length;
    const asistieron = prospectos.filter(p => p.estadoAsistencia === 'Asistió').length;
    const compraron = prospectos.filter(p => p.estadoCompra === 'Compró' || p.estadoCompra === 'Compró servicio Vortexia').length;

    // Ingresos
    const ingresosSetup = prospectos
      .filter(p => p.estadoCompra === 'Compró' || p.estadoCompra === 'Compró servicio Vortexia')
      .length * configuracion.precioSetup;

    const ingresosRetainer = prospectos
      .filter(p => p.estadoCompra === 'Compró servicio Vortexia')
      .length * configuracion.precioRetainerMensual;

    const ingresosTotales = ingresosSetup + ingresosRetainer;

    // Progreso hacia el millón
    const progresoAnual = (ingresosTotales / configuracion.objetivoAnual) * 100;
    const clientesActivos = prospectos.filter(p => p.estadoCompra === 'Compró servicio Vortexia').length;
    const progresoClientes = (clientesActivos / configuracion.clientesNecesariosMiami) * 100;

    return {
      prospectosHoy: prospectosHoy.length,
      prospectosMes: prospectosMes.length,
      respondieron,
      citasAgendadas,
      asistieron,
      compraron,
      ingresosSetup,
      ingresosRetainer,
      ingresosTotales,
      progresoAnual,
      clientesActivos,
      progresoClientes,
      tasaRespuesta: prospectos.length > 0 ? (respondieron / prospectos.length) * 100 : 0,
      tasaConversion: respondieron > 0 ? (compraron / respondieron) * 100 : 0
    };
  }, [prospectos, configuracion]);

  const MetricCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    color = 'vx-gold',
    progress 
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    progress?: number;
  }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="vx-card space-y-4"
    >
      <div className="flex items-center justify-between">
        <Icon className={`text-${color}`} size={24} />
        {progress !== undefined && (
          <span className={`text-xs font-mono text-${color}`}>
            {progress.toFixed(1)}%
          </span>
        )}
      </div>
      
      <div className="space-y-1">
        <p className="label-mono">{title}</p>
        <p className="text-2xl font-serif text-vx-cream">{value}</p>
        {subtitle && <p className="text-xs text-vx-tobacco">{subtitle}</p>}
      </div>

      {progress !== undefined && (
        <div className="progress-track">
          <div 
            className={`progress-fill bg-${color}`}
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-4xl text-vx-cream tracking-tight font-serif">
            COMANDO VORTEXIA
          </h1>
          <p className="label-mono text-vx-tobacco">
            SISTEMA DE CONTROL MILLÓN
          </p>
        </div>
        
        <button 
          onClick={onQuickAdd}
          className="vx-btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          NUEVO PROSPECTO
        </button>
      </div>

      {/* Progreso hacia el Millón */}
      <div className="vx-card space-y-6">
        <h2 className="text-xl font-serif text-vx-gold flex items-center gap-2">
          <Target size={20} />
          Progreso hacia el Millón
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="label-mono">INGRESOS TOTALES</p>
            <p className="text-3xl font-serif text-vx-gold">
              ${metricas.ingresosTotales.toLocaleString()}
            </p>
            <div className="progress-track">
              <div 
                className="progress-fill bg-vx-gold"
                style={{ width: `${Math.min(metricas.progresoAnual, 100)}%` }}
              />
            </div>
            <p className="text-xs text-vx-tobacco">
              {metricas.progresoAnual.toFixed(1)}% del objetivo anual
            </p>
          </div>

          <div className="space-y-2">
            <p className="label-mono">CLIENTES ACTIVOS</p>
            <p className="text-3xl font-serif text-vx-cream">
              {metricas.clientesActivos}
            </p>
            <div className="progress-track">
              <div 
                className="progress-fill bg-vx-forest"
                style={{ width: `${Math.min(metricas.progresoClientes, 100)}%` }}
              />
            </div>
            <p className="text-xs text-vx-tobacco">
              de {configuracion.clientesNecesariosMiami} necesarios para Miami
            </p>
          </div>

          <div className="space-y-2">
            <p className="label-mono">INGRESOS MENSUALES</p>
            <p className="text-3xl font-serif text-vx-amber">
              ${metricas.ingresosRetainer.toLocaleString()}
            </p>
            <p className="text-xs text-vx-tobacco">
              Retainer mensual recurrente
            </p>
          </div>
        </div>
      </div>

      {/* Métricas del Día */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif text-vx-cream">Métricas de Hoy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard
            icon={MessageSquare}
            title="DMs Enviados"
            value={metricas.prospectosHoy}
            subtitle={`Meta: ${configuracion.metaDmsdiarios}`}
            progress={(metricas.prospectosHoy / configuracion.metaDmsdiarios) * 100}
          />
          
          <MetricCard
            icon={TrendingUp}
            title="Respuestas"
            value={metricas.respondieron}
            subtitle={`Tasa: ${metricas.tasaRespuesta.toFixed(1)}%`}
            color="vx-forest"
          />
          
          <MetricCard
            icon={Phone}
            title="Citas Agendadas"
            value={metricas.citasAgendadas}
            subtitle={`Meta: ${configuracion.metaCitasDiarias}`}
            color="vx-amber"
          />
          
          <MetricCard
            icon={CheckCircle2}
            title="Ventas"
            value={metricas.compraron}
            subtitle={`Conversión: ${metricas.tasaConversion.toFixed(1)}%`}
            color="vx-forest"
          />
        </div>
      </div>

      {/* Embudo de Ventas */}
      <div className="vx-card space-y-6">
        <h2 className="text-xl font-serif text-vx-cream flex items-center gap-2">
          <Users size={20} />
          Embudo de Ventas
        </h2>
        
        <div className="space-y-4">
          {[
            { label: 'Prospectos Totales', value: prospectos.length, color: 'bg-vx-tobacco' },
            { label: 'Respondieron', value: metricas.respondieron, color: 'bg-vx-amber' },
            { label: 'Citas Agendadas', value: metricas.citasAgendadas, color: 'bg-vx-gold' },
            { label: 'Asistieron', value: metricas.asistieron, color: 'bg-vx-forest' },
            { label: 'Compraron', value: metricas.compraron, color: 'bg-vx-forest' }
          ].map((etapa, index) => (
            <div key={etapa.label} className="flex items-center gap-4">
              <div className="w-32 text-xs font-mono text-vx-tobacco">
                {etapa.label}
              </div>
              <div className="flex-1 h-8 bg-vx-border relative overflow-hidden">
                <div 
                  className={`h-full ${etapa.color} transition-all duration-1000`}
                  style={{ 
                    width: prospectos.length > 0 
                      ? `${(etapa.value / prospectos.length) * 100}%` 
                      : '0%' 
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono text-vx-cream">
                    {etapa.value}
                  </span>
                </div>
              </div>
              <div className="w-16 text-xs font-mono text-vx-tobacco text-right">
                {prospectos.length > 0 
                  ? `${((etapa.value / prospectos.length) * 100).toFixed(1)}%`
                  : '0%'
                }
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen Financiero */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="vx-card space-y-4">
          <h3 className="font-serif text-lg text-vx-cream">Ingresos por Setup</h3>
          <p className="text-2xl font-serif text-vx-gold">
            ${metricas.ingresosSetup.toLocaleString()}
          </p>
          <p className="text-xs text-vx-tobacco">
            {metricas.compraron} ventas × ${configuracion.precioSetup}
          </p>
        </div>

        <div className="vx-card space-y-4">
          <h3 className="font-serif text-lg text-vx-cream">Ingresos Recurrentes</h3>
          <p className="text-2xl font-serif text-vx-forest">
            ${metricas.ingresosRetainer.toLocaleString()}/mes
          </p>
          <p className="text-xs text-vx-tobacco">
            {metricas.clientesActivos} clientes × ${configuracion.precioRetainerMensual}
          </p>
        </div>
      </div>
    </div>
  );
}