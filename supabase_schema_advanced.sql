-- VORTEXIA MILLÓN - Sistema Avanzado de Prospección
-- Basado en estructura de Airtable pero optimizado para el objetivo del millón

-- Primero eliminar tablas existentes
DROP TABLE IF EXISTS interactions CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS   user_settings CASCADE;
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- 1. PROSPECTOS (Tabla Principal) - Estructura Avanzada
CREATE TABLE prospectos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre_prospecto VARCHAR(255) NOT NULL,
  url_perfil_instagram TEXT NOT NULL,
  url_chat_directo TEXT,
  handle_instagram VARCHAR(255) NOT NULL UNIQUE,
  
  -- Estados del Embudo (Múltiples Dimensiones)
  estado_interes VARCHAR(50) DEFAULT 'Pendiente analizar' CHECK (estado_interes IN (
    'Muy interesado', 
    'Interesado', 
    'Pendiente analizar', 
    'No interesado', 
    'Frío'
  )),
  
  estado_respuesta VARCHAR(50) DEFAULT 'Pendiente' CHECK (estado_respuesta IN (
    'Respondió', 
    'No respondió', 
    'Pendiente'
  )),
  
  estado_cita VARCHAR(50) DEFAULT 'Sin cita' CHECK (estado_cita IN (
    'Cita agendada', 
    'Cita realizada', 
    'Cita cancelada', 
    'Sin cita',
    'Reagendada'
  )),
  
  estado_asistencia VARCHAR(50) DEFAULT 'Sin asistencia' CHECK (estado_asistencia IN (
    'Asistió', 
    'No asistió', 
    'Pendiente', 
    'Sin asistencia'
  )),
  
  estado_compra VARCHAR(50) DEFAULT 'No ha comprado' CHECK (estado_compra IN (
    'Compró', 
    'Compró servicio Vortexia', 
    'No compró', 
    'Pendiente', 
    'No ha comprado'
  )),
  
  -- Información Adicional
  especialidad VARCHAR(255),
  ubicacion VARCHAR(255),
  notas_prospecto TEXT,
  valor_estimado DECIMAL(10,2),
  
  -- Fechas de Seguimiento
  fecha_ultima_interaccion TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  fecha_primer_contacto TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. REUNIONES (Gestión de Citas)
CREATE TABLE reuniones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prospecto_id UUID REFERENCES prospectos(id) ON DELETE CASCADE,
  
  asunto_motivo VARCHAR(255) NOT NULL,
  fecha_reunion TIMESTAMP WITH TIME ZONE NOT NULL,
  motivo_detalle TEXT,
  
  resultado_reunion VARCHAR(50) DEFAULT 'Pendiente' CHECK (resultado_reunion IN (
    'Asistió y compró',
    'Asistió y no compró', 
    'No asistió',
    'Reagendada',
    'Pendiente',
    'Completada',
    'Cancelada'
  )),
  
  notas_reunion TEXT,
  valor_propuesta DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MÉTRICAS DIARIAS (KPIs y Análisis para el Millón)
CREATE TABLE metricas_diarias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fecha DATE NOT NULL UNIQUE,
  
  -- Métricas del Embudo
  mensajes_enviados INTEGER DEFAULT 0,
  respuestas_recibidas INTEGER DEFAULT 0,
  citas_agendadas INTEGER DEFAULT 0,
  asistencia_citas INTEGER DEFAULT 0,
  ventas_realizadas INTEGER DEFAULT 0,
  
  -- Métricas Negativas (Para Análisis)
  no_respondieron INTEGER DEFAULT 0,
  no_agendaron_cita INTEGER DEFAULT 0,
  no_asistieron_cita INTEGER DEFAULT 0,
  no_compraron INTEGER DEFAULT 0,
  
  -- Métricas Financieras (Objetivo Millón)
  ingresos_dia DECIMAL(10,2) DEFAULT 0,
  ingresos_setup DECIMAL(10,2) DEFAULT 0,
  ingresos_retainer DECIMAL(10,2) DEFAULT 0,
  
  -- Análisis IA
  observaciones_ai_resumen TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. CONFIGURACIÓN DEL SISTEMA (Objetivo Millón)
CREATE TABLE configuracion_sistema (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Objetivos Financieros
  objetivo_anual DECIMAL(12,2) DEFAULT 1000000.00, -- 1 Millón
  objetivo_mensual DECIMAL(10,2) DEFAULT 83333.33,
  objetivo_diario DECIMAL(10,2) DEFAULT 2740.00,
  
  -- Precios de Servicios
  precio_setup DECIMAL(10,2) DEFAULT 500.00,
  precio_retainer_mensual DECIMAL(10,2) DEFAULT 300.00,
  
  -- Metas Operativas
  meta_dms_diarios INTEGER DEFAULT 40,
  meta_respuestas_diarias INTEGER DEFAULT 8,
  meta_citas_diarias INTEGER DEFAULT 2,
  meta_ventas_diarias INTEGER DEFAULT 1,
  
  -- Configuración de Alertas
  horas_alerta_seguimiento INTEGER DEFAULT 48,
  
  -- Configuración Miami
  clientes_necesarios_miami INTEGER DEFAULT 278, -- Para 1M con retainer de 300
  costo_vida_miami DECIMAL(10,2) DEFAULT 8000.00,
  
  -- API Keys
  openai_api_key TEXT,
  gemini_api_key TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. HISTORIAL DE INTERACCIONES (Para Seguimiento Detallado)
CREATE TABLE historial_interacciones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  prospecto_id UUID REFERENCES prospectos(id) ON DELETE CASCADE,
  
  tipo_interaccion VARCHAR(50) NOT NULL CHECK (tipo_interaccion IN (
    'Mensaje enviado',
    'Respuesta recibida',
    'Cita agendada',
    'Cita realizada',
    'Seguimiento',
    'Propuesta enviada',
    'Venta cerrada',
    'Lead perdido'
  )),
  
  descripcion TEXT,
  resultado TEXT,
  valor_asociado DECIMAL(10,2),
  
  -- Estados anteriores (para tracking de cambios)
  estado_anterior JSONB,
  estado_nuevo JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX idx_prospectos_handle ON prospectos(handle_instagram);
CREATE INDEX idx_prospectos_estado_interes ON prospectos(estado_interes);
CREATE INDEX idx_prospectos_estado_compra ON prospectos(estado_compra);
CREATE INDEX idx_prospectos_fecha_interaccion ON prospectos(fecha_ultima_interaccion);

CREATE INDEX idx_reuniones_prospecto ON reuniones(prospecto_id);
CREATE INDEX idx_reuniones_fecha ON reuniones(fecha_reunion);
CREATE INDEX idx_reuniones_resultado ON reuniones(resultado_reunion);

CREATE INDEX idx_metricas_fecha ON metricas_diarias(fecha);
CREATE INDEX idx_historial_prospecto ON historial_interacciones(prospecto_id);
CREATE INDEX idx_historial_tipo ON historial_interacciones(tipo_interaccion);

-- FUNCIÓN PARA ACTUALIZAR TIMESTAMPS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- TRIGGERS PARA AUTO-UPDATE
CREATE TRIGGER update_prospectos_updated_at 
  BEFORE UPDATE ON prospectos 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reuniones_updated_at 
  BEFORE UPDATE ON reuniones 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_metricas_updated_at 
  BEFORE UPDATE ON metricas_diarias 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracion_updated_at 
  BEFORE UPDATE ON configuracion_sistema 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- FUNCIÓN PARA CALCULAR MÉTRICAS AUTOMÁTICAMENTE
CREATE OR REPLACE FUNCTION calcular_metricas_diarias(fecha_objetivo DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
  INSERT INTO metricas_diarias (
    fecha,
    mensajes_enviados,
    respuestas_recibidas,
    citas_agendadas,
    asistencia_citas,
    ventas_realizadas,
    no_respondieron,
    no_agendaron_cita,
    no_asistieron_cita,
    no_compraron,
    ingresos_dia,
    ingresos_setup,
    ingresos_retainer
  )
  SELECT 
    fecha_objetivo,
    COUNT(CASE WHEN hi.tipo_interaccion = 'Mensaje enviado' THEN 1 END),
    COUNT(CASE WHEN p.estado_respuesta = 'Respondió' THEN 1 END),
    COUNT(CASE WHEN p.estado_cita IN ('Cita agendada', 'Cita realizada') THEN 1 END),
    COUNT(CASE WHEN p.estado_asistencia = 'Asistió' THEN 1 END),
    COUNT(CASE WHEN p.estado_compra IN ('Compró', 'Compró servicio Vortexia') THEN 1 END),
    COUNT(CASE WHEN p.estado_respuesta = 'No respondió' THEN 1 END),
    COUNT(CASE WHEN p.estado_cita = 'Sin cita' AND p.estado_respuesta = 'Respondió' THEN 1 END),
    COUNT(CASE WHEN p.estado_asistencia = 'No asistió' THEN 1 END),
    COUNT(CASE WHEN p.estado_compra = 'No compró' AND p.estado_asistencia = 'Asistió' THEN 1 END),
    COALESCE(SUM(CASE WHEN p.estado_compra IN ('Compró', 'Compró servicio Vortexia') THEN p.valor_estimado END), 0),
    COALESCE(SUM(CASE WHEN p.estado_compra IN ('Compró', 'Compró servicio Vortexia') THEN cs.precio_setup END), 0),
    COALESCE(SUM(CASE WHEN p.estado_compra = 'Compró servicio Vortexia' THEN cs.precio_retainer_mensual END), 0)
  FROM prospectos p
  LEFT JOIN historial_interacciones hi ON p.id = hi.prospecto_id 
    AND DATE(hi.created_at) = fecha_objetivo
  CROSS JOIN configuracion_sistema cs
  WHERE DATE(p.created_at) = fecha_objetivo OR DATE(p.updated_at) = fecha_objetivo
  ON CONFLICT (fecha) DO UPDATE SET
    mensajes_enviados = EXCLUDED.mensajes_enviados,
    respuestas_recibidas = EXCLUDED.respuestas_recibidas,
    citas_agendadas = EXCLUDED.citas_agendadas,
    asistencia_citas = EXCLUDED.asistencia_citas,
    ventas_realizadas = EXCLUDED.ventas_realizadas,
    no_respondieron = EXCLUDED.no_respondieron,
    no_agendaron_cita = EXCLUDED.no_agendaron_cita,
    no_asistieron_cita = EXCLUDED.no_asistieron_cita,
    no_compraron = EXCLUDED.no_compraron,
    ingresos_dia = EXCLUDED.ingresos_dia,
    ingresos_setup = EXCLUDED.ingresos_setup,
    ingresos_retainer = EXCLUDED.ingresos_retainer,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- INSERTAR CONFIGURACIÓN INICIAL
INSERT INTO configuracion_sistema (
  objetivo_anual,
  objetivo_mensual, 
  objetivo_diario,
  precio_setup,
  precio_retainer_mensual,
  meta_dms_diarios,
  clientes_necesarios_miami
) VALUES (
  1000000.00,
  83333.33,
  2740.00,
  500.00,
  300.00,
  40,
  278
);

-- DESHABILITAR RLS (Sin autenticación)
ALTER TABLE prospectos DISABLE ROW LEVEL SECURITY;
ALTER TABLE reuniones DISABLE ROW LEVEL SECURITY;
ALTER TABLE metricas_diarias DISABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_sistema DISABLE ROW LEVEL SECURITY;
ALTER TABLE historial_interacciones DISABLE ROW LEVEL SECURITY;