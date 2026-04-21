import { supabase } from '../lib/supabase';
import { 
  Prospecto, 
  Reunion, 
  MetricasDiarias, 
  ConfiguracionSistema, 
  HistorialInteraccion,
  EstadoInteres,
  EstadoRespuesta,
  EstadoCita,
  EstadoAsistencia,
  EstadoCompra,
  ResultadoReunion,
  TipoInteraccion
} from '../types';

const DEFAULT_CONFIG: ConfiguracionSistema = {
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
  clientesNecesariosMiami: 278, // Para 1M con retainer de 300
  costoVidaMiami: 8000,
  createdAt: Date.now(),
  updatedAt: Date.now()
};

export const supabaseAdvancedService = {
  // Test connection
  testConnection: async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('prospectos')
        .select('count', { count: 'exact', head: true });
      
      if (error) {
        console.error('Supabase connection error:', error);
        return false;
      }
      
      console.log('Supabase connected successfully');
      return true;
    } catch (error) {
      console.error('Supabase connection failed:', error);
      return false;
    }
  },

  // === PROSPECTOS ===
  getProspectos: async (): Promise<Prospecto[]> => {
    try {
      const { data, error } = await supabase
        .from('prospectos')
        .select('*')
        .order('fecha_ultima_interaccion', { ascending: false });

      if (error) {
        console.error('Error fetching prospectos:', error);
        return [];
      }

      return data.map(p => ({
        id: p.id,
        nombreProspecto: p.nombre_prospecto,
        urlPerfilInstagram: p.url_perfil_instagram,
        urlChatDirecto: p.url_chat_directo,
        handleInstagram: p.handle_instagram,
        estadoInteres: p.estado_interes as EstadoInteres,
        estadoRespuesta: p.estado_respuesta as EstadoRespuesta,
        estadoCita: p.estado_cita as EstadoCita,
        estadoAsistencia: p.estado_asistencia as EstadoAsistencia,
        estadoCompra: p.estado_compra as EstadoCompra,
        especialidad: p.especialidad,
        ubicacion: p.ubicacion,
        notasProspecto: p.notas_prospecto,
        valorEstimado: p.valor_estimado,
        fechaUltimaInteraccion: new Date(p.fecha_ultima_interaccion).getTime(),
        fechaPrimerContacto: new Date(p.fecha_primer_contacto).getTime(),
        createdAt: new Date(p.created_at).getTime(),
        updatedAt: new Date(p.updated_at).getTime()
      }));
    } catch (error) {
      console.error('Unexpected error fetching prospectos:', error);
      return [];
    }
  },

  addProspecto: async (prospecto: Omit<Prospecto, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      // Check if prospecto already exists
      const { data: existing } = await supabase
        .from('prospectos')
        .select('id')
        .eq('handle_instagram', prospecto.handleInstagram)
        .single();

      if (existing) {
        console.log('Prospecto ya existe, actualizando...');
        return supabaseAdvancedService.updateProspecto({ ...prospecto, id: existing.id, createdAt: Date.now(), updatedAt: Date.now() });
      }

      const { error } = await supabase
        .from('prospectos')
        .insert({
          nombre_prospecto: prospecto.nombreProspecto,
          url_perfil_instagram: prospecto.urlPerfilInstagram,
          url_chat_directo: prospecto.urlChatDirecto,
          handle_instagram: prospecto.handleInstagram,
          estado_interes: prospecto.estadoInteres,
          estado_respuesta: prospecto.estadoRespuesta,
          estado_cita: prospecto.estadoCita,
          estado_asistencia: prospecto.estadoAsistencia,
          estado_compra: prospecto.estadoCompra,
          especialidad: prospecto.especialidad,
          ubicacion: prospecto.ubicacion,
          notas_prospecto: prospecto.notasProspecto,
          valor_estimado: prospecto.valorEstimado,
          fecha_ultima_interaccion: new Date(prospecto.fechaUltimaInteraccion).toISOString(),
          fecha_primer_contacto: new Date(prospecto.fechaPrimerContacto).toISOString()
        });

      if (error) {
        console.error('Error adding prospecto:', error);
        alert(`Error al guardar prospecto: ${error.message}`);
        return false;
      }

      // Registrar interacción
      await supabaseAdvancedService.addInteraccion({
        prospectoId: '', // Se actualizará con el ID real
        tipoInteraccion: 'Mensaje enviado',
        descripcion: `Nuevo prospecto agregado: ${prospecto.nombreProspecto}`,
        createdAt: Date.now()
      });

      console.log('Prospecto guardado exitosamente');
      return true;
    } catch (error) {
      console.error('Unexpected error adding prospecto:', error);
      alert(`Error inesperado: ${error}`);
      return false;
    }
  },

  updateProspecto: async (prospecto: Prospecto): Promise<boolean> => {
    try {
      const { data: existing } = await supabase
        .from('prospectos')
        .select('id')
        .eq('handle_instagram', prospecto.handleInstagram)
        .single();

      if (!existing) {
        console.error('Prospecto not found for update');
        return false;
      }

      const { error } = await supabase
        .from('prospectos')
        .update({
          nombre_prospecto: prospecto.nombreProspecto,
          url_perfil_instagram: prospecto.urlPerfilInstagram,
          url_chat_directo: prospecto.urlChatDirecto,
          estado_interes: prospecto.estadoInteres,
          estado_respuesta: prospecto.estadoRespuesta,
          estado_cita: prospecto.estadoCita,
          estado_asistencia: prospecto.estadoAsistencia,
          estado_compra: prospecto.estadoCompra,
          especialidad: prospecto.especialidad,
          ubicacion: prospecto.ubicacion,
          notas_prospecto: prospecto.notasProspecto,
          valor_estimado: prospecto.valorEstimado,
          fecha_ultima_interaccion: new Date(prospecto.fechaUltimaInteraccion).toISOString()
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Error updating prospecto:', error);
        alert(`Error al actualizar prospecto: ${error.message}`);
        return false;
      }

      console.log('Prospecto actualizado exitosamente');
      return true;
    } catch (error) {
      console.error('Unexpected error updating prospecto:', error);
      return false;
    }
  },

  deleteProspecto: async (prospectoId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('prospectos')
        .delete()
        .eq('id', prospectoId);

      if (error) {
        console.error('Error deleting prospecto:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error deleting prospecto:', error);
      return false;
    }
  },

  // === REUNIONES ===
  getReuniones: async (prospectoId?: string): Promise<Reunion[]> => {
    try {
      let query = supabase
        .from('reuniones')
        .select('*')
        .order('fecha_reunion', { ascending: false });

      if (prospectoId) {
        query = query.eq('prospecto_id', prospectoId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching reuniones:', error);
        return [];
      }

      return data.map(r => ({
        id: r.id,
        prospectoId: r.prospecto_id,
        asuntoMotivo: r.asunto_motivo,
        fechaReunion: new Date(r.fecha_reunion).getTime(),
        motivoDetalle: r.motivo_detalle,
        resultadoReunion: r.resultado_reunion as ResultadoReunion,
        notasReunion: r.notas_reunion,
        valorPropuesta: r.valor_propuesta,
        createdAt: new Date(r.created_at).getTime(),
        updatedAt: new Date(r.updated_at).getTime()
      }));
    } catch (error) {
      console.error('Unexpected error fetching reuniones:', error);
      return [];
    }
  },

  addReunion: async (reunion: Omit<Reunion, 'id' | 'createdAt' | 'updatedAt'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('reuniones')
        .insert({
          prospecto_id: reunion.prospectoId,
          asunto_motivo: reunion.asuntoMotivo,
          fecha_reunion: new Date(reunion.fechaReunion).toISOString(),
          motivo_detalle: reunion.motivoDetalle,
          resultado_reunion: reunion.resultadoReunion,
          notas_reunion: reunion.notasReunion,
          valor_propuesta: reunion.valorPropuesta
        });

      if (error) {
        console.error('Error adding reunion:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error adding reunion:', error);
      return false;
    }
  },

  // === MÉTRICAS DIARIAS ===
  getMetricasDiarias: async (fechaInicio?: string, fechaFin?: string): Promise<MetricasDiarias[]> => {
    try {
      let query = supabase
        .from('metricas_diarias')
        .select('*')
        .order('fecha', { ascending: false });

      if (fechaInicio) {
        query = query.gte('fecha', fechaInicio);
      }
      if (fechaFin) {
        query = query.lte('fecha', fechaFin);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching metricas:', error);
        return [];
      }

      return data.map(m => ({
        id: m.id,
        fecha: m.fecha,
        mensajesEnviados: m.mensajes_enviados,
        respuestasRecibidas: m.respuestas_recibidas,
        citasAgendadas: m.citas_agendadas,
        asistenciaCitas: m.asistencia_citas,
        ventasRealizadas: m.ventas_realizadas,
        noRespondieron: m.no_respondieron,
        noAgendaronCita: m.no_agendaron_cita,
        noAsistieronCita: m.no_asistieron_cita,
        noCompraron: m.no_compraron,
        ingresosDia: m.ingresos_dia,
        ingresosSetup: m.ingresos_setup,
        ingresosRetainer: m.ingresos_retainer,
        observacionesAiResumen: m.observaciones_ai_resumen,
        createdAt: new Date(m.created_at).getTime(),
        updatedAt: new Date(m.updated_at).getTime()
      }));
    } catch (error) {
      console.error('Unexpected error fetching metricas:', error);
      return [];
    }
  },

  calcularMetricasHoy: async (): Promise<boolean> => {
    try {
      const { error } = await supabase.rpc('calcular_metricas_diarias');
      
      if (error) {
        console.error('Error calculating metrics:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error calculating metrics:', error);
      return false;
    }
  },

  // === CONFIGURACIÓN ===
  getConfiguracion: async (): Promise<ConfiguracionSistema> => {
    try {
      const { data, error } = await supabase
        .from('configuracion_sistema')
        .select('*')
        .limit(1)
        .single();

      if (error || !data) {
        return DEFAULT_CONFIG;
      }

      return {
        id: data.id,
        objetivoAnual: data.objetivo_anual,
        objetivoMensual: data.objetivo_mensual,
        objetivoDiario: data.objetivo_diario,
        precioSetup: data.precio_setup,
        precioRetainerMensual: data.precio_retainer_mensual,
        metaDmsdiarios: data.meta_dms_diarios,
        metaRespuestasDiarias: data.meta_respuestas_diarias,
        metaCitasDiarias: data.meta_citas_diarias,
        metaVentasDiarias: data.meta_ventas_diarias,
        horasAlertaSeguimiento: data.horas_alerta_seguimiento,
        clientesNecesariosMiami: data.clientes_necesarios_miami,
        costoVidaMiami: data.costo_vida_miami,
        createdAt: new Date(data.created_at).getTime(),
        updatedAt: new Date(data.updated_at).getTime()
      };
    } catch (error) {
      console.error('Unexpected error fetching config:', error);
      return DEFAULT_CONFIG;
    }
  },

  saveConfiguracion: async (config: ConfiguracionSistema): Promise<boolean> => {
    try {
      const { data: existing } = await supabase
        .from('configuracion_sistema')
        .select('id')
        .limit(1)
        .single();

      const configData = {
        objetivo_anual: config.objetivoAnual,
        objetivo_mensual: config.objetivoMensual,
        objetivo_diario: config.objetivoDiario,
        precio_setup: config.precioSetup,
        precio_retainer_mensual: config.precioRetainerMensual,
        meta_dms_diarios: config.metaDmsdiarios,
        meta_respuestas_diarias: config.metaRespuestasDiarias,
        meta_citas_diarias: config.metaCitasDiarias,
        meta_ventas_diarias: config.metaVentasDiarias,
        horas_alerta_seguimiento: config.horasAlertaSeguimiento,
        clientes_necesarios_miami: config.clientesNecesariosMiami,
        costo_vida_miami: config.costoVidaMiami
      };

      let error;
      if (existing) {
        ({ error } = await supabase
          .from('configuracion_sistema')
          .update(configData)
          .eq('id', existing.id));
      } else {
        ({ error } = await supabase
          .from('configuracion_sistema')
          .insert(configData));
      }

      if (error) {
        console.error('Error saving config:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error saving config:', error);
      return false;
    }
  },

  // === HISTORIAL DE INTERACCIONES ===
  addInteraccion: async (interaccion: Omit<HistorialInteraccion, 'id'>): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('historial_interacciones')
        .insert({
          prospecto_id: interaccion.prospectoId,
          tipo_interaccion: interaccion.tipoInteraccion,
          descripcion: interaccion.descripcion,
          resultado: interaccion.resultado,
          valor_asociado: interaccion.valorAsociado,
          estado_anterior: interaccion.estadoAnterior,
          estado_nuevo: interaccion.estadoNuevo
        });

      if (error) {
        console.error('Error adding interaccion:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Unexpected error adding interaccion:', error);
      return false;
    }
  },

  getInteracciones: async (prospectoId: string): Promise<HistorialInteraccion[]> => {
    try {
      const { data, error } = await supabase
        .from('historial_interacciones')
        .select('*')
        .eq('prospecto_id', prospectoId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching interacciones:', error);
        return [];
      }

      return data.map(i => ({
        id: i.id,
        prospectoId: i.prospecto_id,
        tipoInteraccion: i.tipo_interaccion as TipoInteraccion,
        descripcion: i.descripcion,
        resultado: i.resultado,
        valorAsociado: i.valor_asociado,
        estadoAnterior: i.estado_anterior,
        estadoNuevo: i.estado_nuevo,
        createdAt: new Date(i.created_at).getTime()
      }));
    } catch (error) {
      console.error('Unexpected error fetching interacciones:', error);
      return [];
    }
  },

  // === INICIALIZACIÓN ===
  isInitialized: async (): Promise<boolean> => {
    const { data } = await supabase
      .from('configuracion_sistema')
      .select('id')
      .limit(1)
      .single();

    return !!data;
  },

  setInitialized: async (): Promise<boolean> => {
    const { error } = await supabase
      .from('configuracion_sistema')
      .insert(DEFAULT_CONFIG);

    return !error;
  }
};