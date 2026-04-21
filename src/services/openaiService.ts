// OpenAI Service - Configuración nativa para funciones IA
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY || '';
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const openaiService = {
  // Generar análisis de prospecto
  analizarProspecto: async (nombreProspecto: string, especialidad?: string, notas?: string): Promise<string> => {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `Eres un experto en análisis de prospectos para servicios de marketing digital. 
          Analiza el prospecto y proporciona insights sobre:
          1. Potencial de conversión
          2. Estrategia de acercamiento recomendada
          3. Valor estimado del cliente
          4. Puntos de dolor probables
          
          Responde en español, de manera concisa y profesional.`
        },
        {
          role: 'user',
          content: `Analiza este prospecto:
          Nombre: ${nombreProspecto}
          Especialidad: ${especialidad || 'No especificada'}
          Notas: ${notas || 'Sin notas adicionales'}`
        }
      ];

      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 300,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'No se pudo generar análisis';
    } catch (error) {
      console.error('Error analyzing prospecto:', error);
      return 'Error al generar análisis. Verifica la conexión.';
    }
  },

  // Generar mensaje personalizado para prospecto
  generarMensaje: async (nombreProspecto: string, especialidad?: string, contexto?: string): Promise<string> => {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `Eres un experto en copywriting para marketing digital. 
          Genera mensajes personalizados para Instagram DM que:
          1. Sean naturales y no spam
          2. Generen curiosidad
          3. Ofrezcan valor inmediato
          4. Inviten a una conversación
          
          Máximo 150 caracteres. Responde solo el mensaje, sin comillas.`
        },
        {
          role: 'user',
          content: `Genera un mensaje para:
          Prospecto: ${nombreProspecto}
          Especialidad: ${especialidad || 'Emprendedor'}
          Contexto: ${contexto || 'Primer contacto'}`
        }
      ];

      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 100,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Hola! Vi tu perfil y me parece muy interesante lo que haces. ¿Podrías contarme más?';
    } catch (error) {
      console.error('Error generating message:', error);
      return 'Hola! Vi tu perfil y me parece muy interesante lo que haces. ¿Podrías contarme más?';
    }
  },

  // Generar resumen de métricas diarias
  generarResumenMetricas: async (
    mensajesEnviados: number,
    respuestas: number,
    citas: number,
    ventas: number,
    ingresos: number
  ): Promise<string> => {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `Eres un analista de métricas de ventas. Genera un resumen ejecutivo conciso de las métricas diarias.
          Incluye:
          1. Análisis de rendimiento
          2. Áreas de mejora
          3. Recomendaciones específicas
          
          Máximo 200 palabras, tono profesional pero motivador.`
        },
        {
          role: 'user',
          content: `Métricas del día:
          - Mensajes enviados: ${mensajesEnviados}
          - Respuestas recibidas: ${respuestas}
          - Citas agendadas: ${citas}
          - Ventas cerradas: ${ventas}
          - Ingresos generados: $${ingresos}`
        }
      ];

      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 250,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Métricas procesadas correctamente.';
    } catch (error) {
      console.error('Error generating metrics summary:', error);
      return 'Error al generar resumen de métricas.';
    }
  },

  // Sugerir próximos pasos para un prospecto
  sugerirProximosPasos: async (
    estadoActual: string,
    ultimaInteraccion: string,
    diasSinContacto: number
  ): Promise<string> => {
    try {
      const messages: OpenAIMessage[] = [
        {
          role: 'system',
          content: `Eres un consultor de ventas experto. Sugiere los próximos pasos más efectivos para un prospecto.
          Considera el estado actual, la última interacción y el tiempo transcurrido.
          Proporciona 2-3 acciones específicas y prácticas.`
        },
        {
          role: 'user',
          content: `Prospecto:
          - Estado actual: ${estadoActual}
          - Última interacción: ${ultimaInteraccion}
          - Días sin contacto: ${diasSinContacto}`
        }
      ];

      const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages,
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || 'Realizar seguimiento personalizado.';
    } catch (error) {
      console.error('Error generating next steps:', error);
      return 'Realizar seguimiento personalizado según el estado del prospecto.';
    }
  }
};