// Estados del Embudo Avanzado
export type EstadoInteres = 
  | 'Muy interesado' 
  | 'Interesado' 
  | 'Pendiente analizar' 
  | 'No interesado' 
  | 'Frío';

export type EstadoRespuesta = 
  | 'Respondió' 
  | 'No respondió' 
  | 'Pendiente';

export type EstadoCita = 
  | 'Cita agendada' 
  | 'Cita realizada' 
  | 'Cita cancelada' 
  | 'Sin cita'
  | 'Reagendada';

export type EstadoAsistencia = 
  | 'Asistió' 
  | 'No asistió' 
  | 'Pendiente' 
  | 'Sin asistencia';

export type EstadoCompra = 
  | 'Compró' 
  | 'Compró servicio Vortexia' 
  | 'No compró' 
  | 'Pendiente' 
  | 'No ha comprado';

export type ResultadoReunion = 
  | 'Asistió y compró'
  | 'Asistió y no compró' 
  | 'No asistió'
  | 'Reagendada'
  | 'Pendiente'
  | 'Completada'
  | 'Cancelada';

export type TipoInteraccion = 
  | 'Mensaje enviado'
  | 'Respuesta recibida'
  | 'Cita agendada'
  | 'Cita realizada'
  | 'Seguimiento'
  | 'Propuesta enviada'
  | 'Venta cerrada'
  | 'Lead perdido';

// Interfaz Principal del Prospecto (Estructura Avanzada)
export interface Prospecto {
  id: string;
  nombreProspecto: string;
  urlPerfilInstagram: string;
  urlChatDirecto?: string;
  handleInstagram: string;
  
  // Estados del Embudo
  estadoInteres: EstadoInteres;
  estadoRespuesta: EstadoRespuesta;
  estadoCita: EstadoCita;
  estadoAsistencia: EstadoAsistencia;
  estadoCompra: EstadoCompra;
  
  // Información Adicional
  especialidad?: string;
  ubicacion?: string;
  notasProspecto?: string;
  valorEstimado?: number;
  
  // Fechas
  fechaUltimaInteraccion: number;
  fechaPrimerContacto: number;
  createdAt: number;
  updatedAt: number;
}

// Reuniones
export interface Reunion {
  id: string;
  prospectoId: string;
  asuntoMotivo: string;
  fechaReunion: number;
  motivoDetalle?: string;
  resultadoReunion: ResultadoReunion;
  notasReunion?: string;
  valorPropuesta?: number;
  createdAt: number;
  updatedAt: number;
}

// Métricas Diarias para el Objetivo del Millón
export interface MetricasDiarias {
  id: string;
  fecha: string; // YYYY-MM-DD
  
  // Métricas del Embudo
  mensajesEnviados: number;
  respuestasRecibidas: number;
  citasAgendadas: number;
  asistenciaCitas: number;
  ventasRealizadas: number;
  
  // Métricas Negativas
  noRespondieron: number;
  noAgendaronCita: number;
  noAsistieronCita: number;
  noCompraron: number;
  
  // Métricas Financieras (Objetivo Millón)
  ingresosDia: number;
  ingresosSetup: number;
  ingresosRetainer: number;
  
  // Análisis IA
  observacionesAiResumen?: string;
  
  createdAt: number;
  updatedAt: number;
}

// Configuración del Sistema (Objetivo Millón)
export interface ConfiguracionSistema {
  id: string;
  
  // Objetivos Financieros
  objetivoAnual: number; // 1,000,000
  objetivoMensual: number; // ~83,333
  objetivoDiario: number; // ~2,740
  
  // Precios
  precioSetup: number;
  precioRetainerMensual: number;
  
  // Metas Operativas
  metaDmsdiarios: number;
  metaRespuestasDiarias: number;
  metaCitasDiarias: number;
  metaVentasDiarias: number;
  
  // Alertas
  horasAlertaSeguimiento: number;
  
  // Miami
  clientesNecesariosMiami: number;
  costoVidaMiami: number;
  
  // API Keys (opcional)
  openaiApiKey?: string;
  geminiApiKey?: string;
  
  createdAt: number;
  updatedAt: number;
}

// Historial de Interacciones
export interface HistorialInteraccion {
  id: string;
  prospectoId: string;
  tipoInteraccion: TipoInteraccion;
  descripcion?: string;
  resultado?: string;
  valorAsociado?: number;
  estadoAnterior?: any;
  estadoNuevo?: any;
  createdAt: number;
}
