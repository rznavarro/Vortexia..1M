-- Crear tabla de configuraciones de usuario (sin autenticación)
CREATE TABLE user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  miami_goal_clients INTEGER DEFAULT 10,
  miami_life_cost DECIMAL(10,2) DEFAULT 5000.00,
  setup_price DECIMAL(10,2) DEFAULT 2500.00,
  retainer_price DECIMAL(10,2) DEFAULT 1500.00,
  follow_up_alert_hours INTEGER DEFAULT 24,
  daily_dm_goal INTEGER DEFAULT 20,
  openai_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de leads (sin autenticación)
CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  handle VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255),
  location VARCHAR(255),
  status VARCHAR(50) NOT NULL CHECK (status IN (
    'ENVIÉ DM', 
    'RESPONDIÓ', 
    'AGENDÓ CITA', 
    'NO RESPONDIÓ', 
    'INTERESADO', 
    'NO INTERESADO', 
    'CALIFICADO',
    'CITAS',
    'PROPUESTAS',
    'CERRADOS', 
    'PERDIDOS'
  )),
  last_interaction_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  notes TEXT,
  estimated_value DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de interacciones (sin autenticación)
CREATE TABLE interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN (
    'ENVIÉ DM', 
    'RESPONDIÓ', 
    'AGENDÓ CITA', 
    'NO RESPONDIÓ', 
    'INTERESADO', 
    'NO INTERESADO', 
    'CALIFICADO',
    'CITAS',
    'PROPUESTAS',
    'CERRADOS', 
    'PERDIDOS'
  )),
  notes TEXT,
  result TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_interactions_lead_id ON interactions(lead_id);
CREATE INDEX idx_interactions_created_at ON interactions(created_at);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_user_settings_updated_at 
  BEFORE UPDATE ON user_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
  BEFORE UPDATE ON leads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();