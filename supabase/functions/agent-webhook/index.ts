
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0'

interface WebhookPayload {
  lead?: {
    name: string;
    email?: string;
    phone?: string;
    company?: string;
    position?: string;
    notes?: string;
  };
  organization: string;
  source?: string;
  timestamp: string;
}

serve(async (req) => {
  try {
    // Criar cliente Supabase usando variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verificar se é uma requisição OPTIONS (CORS preflight)
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    // Verificar se é POST
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Método não permitido' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Verificar cabeçalhos de autorização
    const authHeader = req.headers.get('Authorization');
    
    // Validação de autorização (simplificada para demo)
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Autorização necessária' }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const apiKey = authHeader.split('Bearer ')[1];
    
    // Verificar chave de API (em produção, validar contra um banco de dados)
    if (apiKey !== Deno.env.get('API_KEY')) {
      return new Response(JSON.stringify({ error: 'Chave de API inválida' }), {
        status: 403,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Processar payload
    const payload: WebhookPayload = await req.json();

    // Validação de campos obrigatórios
    if (!payload.organization) {
      return new Response(JSON.stringify({ error: 'Organização é obrigatória' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Processar dados recebidos
    if (payload.lead) {
      // Obter id da organização
      const { data: orgData, error: orgError } = await supabase
        .from('organizations')
        .select('id')
        .eq('name', payload.organization)
        .single();

      if (orgError) {
        return new Response(JSON.stringify({ error: `Organização não encontrada: ${orgError.message}` }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Inserir lead
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .insert({
          name: payload.lead.name,
          company: payload.lead.company || 'Não informado',
          email: payload.lead.email,
          phone: payload.lead.phone,
          position: payload.lead.position,
          notes: payload.lead.notes,
          status: 'qualified',
          value: 0,
          organization_id: orgData.id,
          source: payload.source || 'API'
        })
        .select();

      if (leadError) {
        return new Response(JSON.stringify({ error: `Erro ao criar lead: ${leadError.message}` }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Sucesso
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Lead criado com sucesso',
        data: leadData[0]
      }), {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    // Resposta para outros tipos de payload
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Payload recebido com sucesso',
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    // Log de erro e resposta
    console.error('Erro ao processar requisição:', error);
    return new Response(JSON.stringify({ error: `Erro interno do servidor: ${error.message}` }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
})
