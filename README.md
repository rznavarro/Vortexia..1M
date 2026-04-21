# 🚀 VORTEXIA MILLÓN - Sistema Avanzado de Prospección

Sistema completo de gestión de prospectos diseñado para alcanzar **$1,000,000 anuales** a través de un embudo de ventas optimizado y métricas automáticas.

## ✨ Características Principales

### 🎯 Dashboard del Millón
- **Progreso en tiempo real** hacia el objetivo de $1,000,000
- **Métricas automáticas** de ingresos y conversión
- **Seguimiento de clientes activos** para Miami
- **Embudo de ventas visual** completo

### 📊 Embudo de 5 Estados
1. **Interés** → Análisis inicial del prospecto
2. **Respuesta** → Seguimiento de comunicación
3. **Cita** → Gestión de reuniones
4. **Asistencia** → Control de asistencia a citas
5. **Compra** → Cierre de ventas

### 💰 Métricas Financieras
- **Objetivo anual**: $1,000,000
- **Meta diaria**: $2,740
- **Precio setup**: $500 por venta
- **Retainer mensual**: $300 por cliente
- **Clientes necesarios**: 278 para alcanzar el millón

### 🤖 Inteligencia Artificial
- **Análisis automático** de prospectos
- **Generación de mensajes** personalizados
- **Resúmenes de métricas** diarias
- **Sugerencias de próximos pasos**

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion
- **Base de datos**: Supabase (PostgreSQL)
- **IA**: OpenAI GPT-3.5 Turbo
- **Iconos**: Lucide React

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone https://github.com/rznavarro/Vortexia..1M.git
cd Vortexia..1M
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Copia `.env.example` a `.env.local` y configura:

```env
# Supabase Configuration
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=tu_supabase_anon_key

# OpenAI Configuration (opcional)
VITE_OPENAI_API_KEY=tu_openai_api_key
```

### 4. Configurar Supabase
1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el script SQL en `supabase_schema_advanced.sql`
3. Configura las variables de entorno

### 5. Ejecutar el proyecto
```bash
npm run dev
```

## 📋 Estructura del Proyecto

```
src/
├── components/
│   ├── layout/
│   │   └── Sidebar.tsx          # Navegación principal
│   ├── screens/
│   │   ├── ComandoAdvanced.tsx  # Dashboard principal
│   │   ├── Leads.tsx            # Gestión de prospectos
│   │   ├── Pipeline.tsx         # Embudo de ventas
│   │   ├── Miami.tsx            # Métricas de Miami
│   │   └── Config.tsx           # Configuración
│   └── modals/
│       └── QuickAddProspecto.tsx # Agregar prospecto rápido
├── services/
│   ├── supabaseAdvancedService.ts # Servicio de base de datos
│   └── openaiService.ts          # Servicio de IA
├── types/
│   └── index.ts                  # Definiciones de tipos
└── lib/
    └── supabase.ts              # Cliente de Supabase
```

## 🎮 Uso del Sistema

### 1. Onboarding Inicial
- Completa la configuración inicial con tus objetivos
- Define precios de servicios y metas diarias

### 2. Gestión de Prospectos
- **Agregar prospectos**: Usa el botón "+" o el modal rápido
- **Seguimiento**: Actualiza estados en tiempo real
- **Análisis IA**: Obtén insights automáticos de cada prospecto

### 3. Dashboard de Métricas
- **Progreso del millón**: Ve tu avance hacia $1,000,000
- **Métricas diarias**: Seguimiento de KPIs importantes
- **Alertas de urgencia**: Prospectos que necesitan seguimiento

### 4. Embudo de Ventas
- **Pipeline visual**: Ve el estado de todos los prospectos
- **Gestión de citas**: Agenda y da seguimiento a reuniones
- **Análisis de conversión**: Optimiza tu proceso de ventas

## 🔧 Configuración Avanzada

### Objetivos Financieros
- **Objetivo anual**: Personalizable (default: $1,000,000)
- **Precios de servicios**: Setup y retainer configurables
- **Metas operativas**: DMs diarios, respuestas, citas, ventas

### Alertas y Seguimiento
- **Horas de alerta**: Tiempo límite para seguimiento (default: 48h)
- **Métricas automáticas**: Cálculo diario de KPIs
- **Notificaciones**: Prospectos que requieren atención

### Integración IA
- **OpenAI**: Análisis de prospectos y generación de mensajes
- **Análisis automático**: Insights sobre potencial de conversión
- **Mensajes personalizados**: Generación automática para Instagram

## 📊 Métricas y KPIs

### Métricas Diarias
- Mensajes enviados
- Respuestas recibidas  
- Citas agendadas
- Asistencia a citas
- Ventas realizadas
- Ingresos generados

### Análisis del Embudo
- Tasa de respuesta
- Tasa de conversión a cita
- Tasa de asistencia
- Tasa de cierre de ventas
- Valor promedio por cliente

## 🔒 Seguridad

- **Variables de entorno**: API keys nunca hardcodeadas
- **Supabase RLS**: Row Level Security deshabilitado para simplicidad
- **Validación de datos**: Tipos TypeScript estrictos
- **Error handling**: Manejo robusto de errores

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🎯 Roadmap

- [ ] **Integración WhatsApp**: Gestión de mensajes directos
- [ ] **Analytics avanzados**: Dashboards con gráficos interactivos  
- [ ] **Automatización**: Secuencias de seguimiento automáticas
- [ ] **Mobile app**: Aplicación móvil nativa
- [ ] **Integraciones**: CRM, calendarios, herramientas de marketing

## 📞 Soporte

¿Necesitas ayuda? Abre un [issue](https://github.com/rznavarro/Vortexia..1M/issues) o contacta al equipo.

---

**🚀 ¡Alcanza tu primer millón con Vortexia!** 💰