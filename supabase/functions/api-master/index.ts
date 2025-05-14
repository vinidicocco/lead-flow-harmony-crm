
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.29.0'

// Interface para request de autenticação
interface AuthRequest {
  email: string;
  password: string;
}

serve(async (req) => {
  try {
    // Criar cliente Supabase usando variáveis de ambiente
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Configurar headers CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      'Content-Type': 'application/json',
    };
    
    // Gerenciar requisição de preflight CORS
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Obter o path da URL
    const url = new URL(req.url);
    const path = url.pathname.substring('/api-master'.length);

    // Rota de autenticação
    if (path === '/auth' && req.method === 'POST') {
      try {
        const { email, password } = await req.json() as AuthRequest;
        
        if (!email || !password) {
          return new Response(
            JSON.stringify({ error: 'Email e senha são obrigatórios' }),
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Fazer login usando a API do Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (authError) {
          return new Response(
            JSON.stringify({ error: 'Credenciais inválidas' }),
            { status: 401, headers: corsHeaders }
          );
        }
        
        // Verificar se o usuário tem permissão de MASTER
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
          
        if (userError || userData.role !== 'MASTER') {
          return new Response(
            JSON.stringify({ error: 'Acesso não autorizado' }),
            { status: 403, headers: corsHeaders }
          );
        }
        
        // Retorna o token de acesso
        return new Response(
          JSON.stringify({
            token: authData.session.access_token,
            expires_at: authData.session.expires_at
          }),
          { status: 200, headers: corsHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: `Erro na autenticação: ${error.message}` }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    
    // Verificar autorização para todas as outras rotas
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Autorização necessária' }),
        { status: 401, headers: corsHeaders }
      );
    }
    
    const token = authHeader.split('Bearer ')[1];
    
    // Verificar o token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Token inválido ou expirado' }),
        { status: 401, headers: corsHeaders }
      );
    }
    
    // Verificar se é um MASTER
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (userError || userData.role !== 'MASTER') {
      return new Response(
        JSON.stringify({ error: 'Somente administradores MASTER podem acessar esta API' }),
        { status: 403, headers: corsHeaders }
      );
    }
    
    // Rotas disponíveis
    
    // Listar organizações
    if (path === '/organizations' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');
        
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      return new Response(
        JSON.stringify({ organizations: data }),
        { status: 200, headers: corsHeaders }
      );
    }
    
    // Estatísticas gerais
    if (path === '/stats' && req.method === 'GET') {
      // Total de usuários por organização
      const { data: userStats, error: userError } = await supabase
        .from('profiles')
        .select('organization_id, organizations!inner(name), role')
        .order('organization_id');
        
      if (userError) {
        return new Response(
          JSON.stringify({ error: userError.message }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      // Agrupar por organização
      const orgMap = new Map();
      userStats.forEach(user => {
        const orgId = user.organization_id;
        if (!orgMap.has(orgId)) {
          orgMap.set(orgId, {
            organization_id: orgId,
            name: user.organizations.name,
            users: {
              total: 0,
              master: 0,
              admin: 0,
              user: 0
            }
          });
        }
        
        const orgStats = orgMap.get(orgId);
        orgStats.users.total += 1;
        orgStats.users[user.role.toLowerCase()] += 1;
      });
      
      // Total de leads por organização
      const { data: leadStats, error: leadError } = await supabase
        .from('leads')
        .select('organization_id, status')
        .order('organization_id');
        
      if (leadError) {
        return new Response(
          JSON.stringify({ error: leadError.message }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      // Agrupar leads por organização
      leadStats.forEach(lead => {
        const orgId = lead.organization_id;
        if (orgMap.has(orgId)) {
          const orgStats = orgMap.get(orgId);
          
          if (!orgStats.leads) {
            orgStats.leads = {
              total: 0,
              qualified: 0,
              contact_attempt: 0,
              contacted: 0,
              proposal: 0,
              contract: 0,
              payment: 0,
              closed: 0
            };
          }
          
          orgStats.leads.total += 1;
          if (lead.status) {
            orgStats.leads[lead.status] = (orgStats.leads[lead.status] || 0) + 1;
          }
        }
      });
      
      return new Response(
        JSON.stringify({ stats: Array.from(orgMap.values()) }),
        { status: 200, headers: corsHeaders }
      );
    }
    
    // Listar usuários
    if (path === '/users' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          organizations:organization_id (name, code)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: corsHeaders }
        );
      }
      
      return new Response(
        JSON.stringify({ users: data }),
        { status: 200, headers: corsHeaders }
      );
    }
    
    // Criar usuário (apenas MASTER)
    if (path === '/users' && req.method === 'POST') {
      try {
        const body = await req.json();
        const { email, password, first_name, last_name, organization_id, role } = body;
        
        if (!email || !password || !first_name || !last_name || !organization_id || !role) {
          return new Response(
            JSON.stringify({ error: 'Campos obrigatórios ausentes' }),
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Obter código da organização
        const { data: orgData, error: orgError } = await supabase
          .from('organizations')
          .select('code')
          .eq('id', organization_id)
          .single();
          
        if (orgError) {
          return new Response(
            JSON.stringify({ error: 'Organização não encontrada' }),
            { status: 400, headers: corsHeaders }
          );
        }
        
        // Criar o usuário
        const { data, error } = await supabase.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: {
            first_name,
            last_name,
            organization: orgData.code,
            role
          }
        });
        
        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { status: 500, headers: corsHeaders }
          );
        }
        
        return new Response(
          JSON.stringify({ success: true, user: data.user }),
          { status: 201, headers: corsHeaders }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: `Erro ao criar usuário: ${error.message}` }),
          { status: 500, headers: corsHeaders }
        );
      }
    }
    
    // Endpoint não encontrado
    return new Response(
      JSON.stringify({ error: 'Endpoint não encontrado' }),
      { status: 404, headers: corsHeaders }
    );
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
