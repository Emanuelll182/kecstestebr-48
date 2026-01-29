import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, UserX, UserCheck, Phone, Building2, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Cliente {
  id: string;
  codigo: number;
  empresa_nome: string;
  endereco?: string | null;
  cidade_estado?: string | null;
  bairro?: string | null;
  contato?: string | null;
  cnpj_cpf?: string | null;
  telefone?: string | null;
  cep?: string | null;
  insc_estadual_identidade?: string | null;
  fax?: string | null;
  is_active?: boolean;
  created_at: string;
}

const initialFormData = {
  empresa_nome: '',
  endereco: '',
  cidade_estado: '',
  bairro: '',
  contato: '',
  cnpj_cpf: '',
  telefone: '',
  cep: '',
  insc_estadual_identidade: '',
  fax: '',
};

const ClientManagement = () => {
  const [clients, setClients] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('codigo', { ascending: true });

      if (error) throw error;
      setClients((data || []) as Cliente[]);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar clientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error } = await supabase
        .from('clientes')
        .insert({
          empresa_nome: formData.empresa_nome,
          endereco: formData.endereco || null,
          cidade_estado: formData.cidade_estado || null,
          bairro: formData.bairro || null,
          contato: formData.contato || null,
          cnpj_cpf: formData.cnpj_cpf || null,
          telefone: formData.telefone || null,
          cep: formData.cep || null,
          insc_estadual_identidade: formData.insc_estadual_identidade || null,
          fax: formData.fax || null,
          is_active: true,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso!",
      });

      setFormData(initialFormData);
      setIsDialogOpen(false);
      fetchClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar cliente",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('clientes')
        .update({
          empresa_nome: formData.empresa_nome,
          endereco: formData.endereco || null,
          cidade_estado: formData.cidade_estado || null,
          bairro: formData.bairro || null,
          contato: formData.contato || null,
          cnpj_cpf: formData.cnpj_cpf || null,
          telefone: formData.telefone || null,
          cep: formData.cep || null,
          insc_estadual_identidade: formData.insc_estadual_identidade || null,
          fax: formData.fax || null,
        })
        .eq('id', editingClient.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente atualizado com sucesso!",
      });

      setEditingClient(null);
      setFormData(initialFormData);
      setIsDialogOpen(false);
      fetchClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar cliente",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (client: Cliente) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .update({ is_active: !client.is_active })
        .eq('id', client.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Cliente ${client.is_active ? 'desativado' : 'ativado'} com sucesso!`,
      });

      fetchClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar status do cliente",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async (client: Cliente) => {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', client.id);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Cliente excluído com sucesso!",
      });

      fetchClients();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir cliente",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (client: Cliente) => {
    setEditingClient(client);
    setFormData({
      empresa_nome: client.empresa_nome || '',
      endereco: client.endereco || '',
      cidade_estado: client.cidade_estado || '',
      bairro: client.bairro || '',
      contato: client.contato || '',
      cnpj_cpf: client.cnpj_cpf || '',
      telefone: client.telefone || '',
      cep: client.cep || '',
      insc_estadual_identidade: client.insc_estadual_identidade || '',
      fax: client.fax || '',
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingClient(null);
    setFormData(initialFormData);
    setIsDialogOpen(true);
  };

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase();
    return (
      client.empresa_nome.toLowerCase().includes(searchLower) ||
      client.codigo.toString().includes(searchLower) ||
      client.cnpj_cpf?.toLowerCase().includes(searchLower) ||
      client.contato?.toLowerCase().includes(searchLower) ||
      client.telefone?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gerenciar Clientes</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-gradient-primary hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <form onSubmit={editingClient ? handleUpdateClient : handleCreateClient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="empresa_nome">Nome da Empresa *</Label>
                    <Input
                      id="empresa_nome"
                      value={formData.empresa_nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, empresa_nome: e.target.value }))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cnpj_cpf">CNPJ/CPF</Label>
                    <Input
                      id="cnpj_cpf"
                      value={formData.cnpj_cpf}
                      onChange={(e) => setFormData(prev => ({ ...prev, cnpj_cpf: e.target.value }))}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="insc_estadual_identidade">Insc. Estadual / Identidade</Label>
                    <Input
                      id="insc_estadual_identidade"
                      value={formData.insc_estadual_identidade}
                      onChange={(e) => setFormData(prev => ({ ...prev, insc_estadual_identidade: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contato">Contato</Label>
                    <Input
                      id="contato"
                      value={formData.contato}
                      onChange={(e) => setFormData(prev => ({ ...prev, contato: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      type="tel"
                      value={formData.telefone}
                      onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fax">Fax</Label>
                    <Input
                      id="fax"
                      value={formData.fax}
                      onChange={(e) => setFormData(prev => ({ ...prev, fax: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cep">CEP</Label>
                    <Input
                      id="cep"
                      value={formData.cep}
                      onChange={(e) => setFormData(prev => ({ ...prev, cep: e.target.value }))}
                      placeholder="00000-000"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bairro">Bairro</Label>
                    <Input
                      id="bairro"
                      value={formData.bairro}
                      onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cidade_estado">Cidade/Estado</Label>
                    <Input
                      id="cidade_estado"
                      value={formData.cidade_estado}
                      onChange={(e) => setFormData(prev => ({ ...prev, cidade_estado: e.target.value }))}
                      placeholder="São Paulo - SP"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90" disabled={saving}>
                    {saving ? 'Salvando...' : (editingClient ? 'Atualizar' : 'Cadastrar')}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, código, CNPJ/CPF, contato ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredClients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchTerm ? 'Nenhum cliente encontrado para esta busca.' : 'Nenhum cliente cadastrado.'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cód.</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>CNPJ/CPF</TableHead>
                    <TableHead>Contato</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Cidade/Estado</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClients.map((client) => (
                    <TableRow key={client.id} className={!client.is_active ? 'opacity-60' : ''}>
                      <TableCell className="font-mono">{client.codigo}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{client.empresa_nome}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {client.cnpj_cpf || '-'}
                      </TableCell>
                      <TableCell>{client.contato || '-'}</TableCell>
                      <TableCell>
                        {client.telefone ? (
                          <div className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <span>{client.telefone}</span>
                          </div>
                        ) : '-'}
                      </TableCell>
                      <TableCell>{client.cidade_estado || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={client.is_active ? 'default' : 'destructive'}>
                          {client.is_active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(client)}
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant={client.is_active ? "destructive" : "default"}
                            onClick={() => handleToggleActive(client)}
                            title={client.is_active ? 'Desativar' : 'Ativar'}
                          >
                            {client.is_active ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive" title="Excluir">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o cliente "{client.empresa_nome}"? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteClient(client)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientManagement;
