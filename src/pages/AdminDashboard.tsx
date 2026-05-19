import React, { useState, useEffect, useMemo } from 'react';
import { getSupabase, AffiliateLink, Lead } from '@/src/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  ExternalLink, 
  Copy, 
  Search, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users,
  Trash2,
  AlertCircle,
  PowerOff,
  Sparkles
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [links, setLinks] = useState<AffiliateLink[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activeTab, setActiveTab] = useState<'links' | 'leads'>('links');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome_produto: '',
    url_original: '',
    slug_curto: '',
    moeda: 'BRL',
    pixel_id: '',
    tiktok_pixel_id: '',
    google_tag_id: ''
  });

  useEffect(() => {
    fetchLinks();
    fetchLeads();
  }, []);

  async function fetchLinks() {
    setLoading(true);
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('links_afiliados')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast.error('Erro ao buscar links');
      } else {
        setLinks(data || []);
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de configuração do Supabase');
    }
    setLoading(false);
  }

  async function fetchLeads() {
    try {
      const client = getSupabase();
      const { data, error } = await client
        .from('leads_v3')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) {
        setLeads(data || []);
      }
    } catch (err: any) {
      console.error('Erro ao buscar leads', err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const client = getSupabase();
      const { error } = await client
        .from('links_afiliados')
        .insert([formData]);

      if (error) {
        if (error.code === '23505') {
          toast.error('Este Slug já está em uso.');
        } else {
          toast.error(`Erro ao cadastrar: ${error.message}`);
          console.error('Supabase raw error:', error);
        }
      } else {
        toast.success('Link cadastrado com sucesso!');
        setFormData({
          nome_produto: '',
          url_original: '',
          slug_curto: '',
          moeda: 'BRL',
          pixel_id: '',
          tiktok_pixel_id: '',
          google_tag_id: ''
        });
        fetchLinks();
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de configuração do Supabase');
    }
  }

  async function executeDelete(id: string) {
    try {
      const client = getSupabase();
      const { error } = await client
        .from('links_afiliados')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error('Erro ao excluir link');
      } else {
        toast.success('Link removido');
        fetchLinks();
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro de configuração do Supabase');
    }
  }

  function deleteLink(id: string) {
    // Usando o toast no lugar do window.confirm nativo, pois o iframe do preview bloqueia alerts/confirms
    toast('Tem certeza que deseja excluir este link?', {
      action: {
        label: 'Sim, excluir',
        onClick: () => executeDelete(id)
      },
      cancel: {
        label: 'Cancelar',
        onClick: () => console.log('Cancelado')
      }
    });
  }

  const copyToClipboard = (slug: string) => {
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success('Link público copiado!');
  };

  const handleLogout = async () => {
    const { error } = await getSupabase().auth.signOut();
    if (!error) navigate('/login');
  };

  const chartData = useMemo(() => {
    return [...links]
      .sort((a, b) => (b.cliques || 0) - (a.cliques || 0))
      .slice(0, 7)
      .map((l) => ({ name: l.slug_curto, cliques: l.cliques || 0 }));
  }, [links]);

  const filteredLinks = links.filter(link => 
    link.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) || 
    link.slug_curto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white border-bottom border-slate-200 py-6 px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-blue-600 w-8 h-8" />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Global Affiliate <span className="text-blue-600">Hub</span></h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/analista" className="flex items-center gap-2 text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 px-4 py-2 rounded-full transition-colors">
              <Sparkles className="w-4 h-4" />
              IA Estratégica
            </Link>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Admin v2.0
            </span>
            <button onClick={handleLogout} title="Sair" className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
              <PowerOff className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 mt-10">
        
        {/* Painel de Gráfico Simples */}
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Top 7 Links por Cliques
          </h2>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCliques" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="cliques" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCliques)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Column */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Plus className="w-5 h-5 text-blue-600" />
                  Novo Link de Afiliado
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input 
                      id="nome" 
                      placeholder="Ex: Teclado Mecânico RGB" 
                      required 
                      value={formData.nome_produto}
                      onChange={(e) => setFormData({...formData, nome_produto: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url">URL de Afiliado</Label>
                    <Input 
                      id="url" 
                      type="url" 
                      placeholder="https://shopee.com.br/product/..." 
                      required 
                      value={formData.url_original}
                      onChange={(e) => setFormData({...formData, url_original: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug Desejado</Label>
                      <Input 
                        id="slug" 
                        placeholder="teclado-rgb" 
                        required 
                        value={formData.slug_curto}
                        onChange={(e) => setFormData({...formData, slug_curto: e.target.value.toLowerCase().replace(/ /g, '-')})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="moeda">Moeda</Label>
                      <select 
                        id="moeda"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.moeda}
                        onChange={(e) => setFormData({...formData, moeda: e.target.value})}
                      >
                        <option value="BRL">BRL (R$)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pixel">Facebook Pixel ID (Opcional)</Label>
                      <Input 
                        id="pixel" 
                        placeholder="Digite o ID numérico" 
                        value={formData.pixel_id}
                        onChange={(e) => setFormData({...formData, pixel_id: e.target.value})}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="tiktok_pixel">TikTok Pixel ID (Opcional)</Label>
                        <Input 
                          id="tiktok_pixel" 
                          placeholder="Ex: CBX..." 
                          value={formData.tiktok_pixel_id}
                          onChange={(e) => setFormData({...formData, tiktok_pixel_id: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="google_tag">Google Tag ID (Opcional)</Label>
                        <Input 
                          id="google_tag" 
                          placeholder="Ex: G-XXXXX..." 
                          value={formData.google_tag_id}
                          onChange={(e) => setFormData({...formData, google_tag_id: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 mt-4 h-12 text-lg">
                    Criar Link Afiliado
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 italic text-blue-800 text-sm">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <p>O rastreio do Pixel é disparado automaticamente na página de redirecionamento antes de levar o usuário para a URL final.</p>
            </div>
          </div>

          {/* List Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-4 justify-between items-center">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  onClick={() => setActiveTab('links')} 
                  variant={activeTab === 'links' ? 'default' : 'outline'}
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Package className="w-4 h-4" /> Links
                </Button>
                <Button 
                  onClick={() => setActiveTab('leads')} 
                  variant={activeTab === 'leads' ? 'default' : 'outline'}
                  className="flex-1 sm:flex-none gap-2"
                >
                  <Users className="w-4 h-4" /> Leads ({leads.length})
                </Button>
              </div>
              {activeTab === 'links' && (
                <div className="relative flex-1 w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <Input
                    className="pl-10"
                    placeholder="Buscar links..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
            </div>

            <Card className="border-slate-200 shadow-lg overflow-hidden">
              {activeTab === 'links' ? (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold">Produto</TableHead>
                      <TableHead className="font-bold">Slug / Link</TableHead>
                      <TableHead className="font-bold text-center">Cliques</TableHead>
                      <TableHead className="font-bold text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                          Carregando links...
                        </TableCell>
                      </TableRow>
                    ) : links.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                          Nenhum link encontrado. Crie o seu primeiro!
                        </TableCell>
                      </TableRow>
                ) : filteredLinks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                      Nenhum link corresponde à busca.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLinks.map((link) => (
                        <TableRow key={link.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                <Package className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">{link.nome_produto}</div>
                                <div className="text-xs text-slate-500">{link.moeda === 'BRL' ? 'Real Brasileiro' : link.moeda}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <code className="text-xs bg-slate-100 px-2 py-0.5 rounded text-blue-700 w-fit">/{link.slug_curto}</code>
                              <button 
                                onClick={() => copyToClipboard(link.slug_curto)}
                                className="text-[10px] text-slate-400 hover:text-blue-600 flex items-center gap-1 transition-colors uppercase font-bold tracking-tighter"
                              >
                                <Copy className="w-3 h-3" /> Copiar Link
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-mono font-medium text-lg text-slate-800">{link.cliques}</div>
                            <div className="text-[10px] text-slate-400 uppercase font-bold">Acessos</div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <a 
                                href={link.url_original} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                                title="Visualizar Original"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                              <button 
                                onClick={() => deleteLink(link.id)}
                                className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              ) : (
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-bold">Nome</TableHead>
                      <TableHead className="font-bold">E-mail</TableHead>
                      <TableHead className="font-bold">Origem</TableHead>
                      <TableHead className="font-bold">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-10 text-slate-400">
                          Nenhum lead capturado ainda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      leads.map((lead) => (
                        <TableRow key={lead.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="font-medium text-slate-900">{lead.name}</TableCell>
                          <TableCell className="text-slate-600">{lead.email}</TableCell>
                          <TableCell>
                            <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded-md text-xs">
                              {lead.origin || 'N/A'}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-500 text-sm">
                            {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </div>
        </div>
      </main>

      {/* Footer info */}
      <footer className="mt-20 border-t border-slate-200 py-10 px-8 text-center text-slate-500 text-sm">
        <p>© 2026 Global Affiliate Hub - Infraestrutura Base</p>
        <p className="mt-2">Conecte seu Supabase e Meta Pixel nas configurações.</p>
      </footer>
    </div>
  );
}
