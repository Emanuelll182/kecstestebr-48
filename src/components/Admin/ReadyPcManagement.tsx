import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { Pencil, Trash2, Plus, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ReadyPc {
  id: string;
  name: string;
  description: string;
  image_url?: string;
  game_image_url?: string;
  price_varejo: number;
  price_revenda: number;
  specs: string;
  is_active: boolean;
  created_at: string;
}

const ReadyPcManagement = () => {
  const { user } = useAuth();
  const [readyPcs, setReadyPcs] = useState<ReadyPc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPc, setEditingPc] = useState<ReadyPc | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image_url: '',
    game_image_url: '',
    price_varejo: 0,
    price_revenda: 0,
    specs: '',
    is_active: true
  });

  useEffect(() => {
    if (user) {
      fetchReadyPcs();
    }
  }, [user]);

  const fetchReadyPcs = async () => {
    try {
      // For now, use empty array since table doesn't exist yet
      setReadyPcs([]);
    } catch (error) {
      console.error('Erro ao buscar PCs prontos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os PCs prontos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // For now, just show success message since table doesn't exist yet
      toast({
        title: "Aviso",
        description: "Funcionalidade será ativada após criação da tabela no banco de dados",
        variant: "default"
      });

      setIsDialogOpen(false);
      setEditingPc(null);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar PC pronto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o PC pronto",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (pc: ReadyPc) => {
    setEditingPc(pc);
    setFormData({
      name: pc.name,
      description: pc.description,
      image_url: pc.image_url || '',
      game_image_url: pc.game_image_url || '',
      price_varejo: pc.price_varejo,
      price_revenda: pc.price_revenda,
      specs: pc.specs,
      is_active: pc.is_active
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este PC pronto?')) return;

    try {
      // For now, just show message since table doesn't exist yet
      toast({
        title: "Aviso",
        description: "Funcionalidade será ativada após criação da tabela no banco de dados",
        variant: "default"
      });
    } catch (error) {
      console.error('Erro ao excluir PC pronto:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o PC pronto",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image_url: '',
      game_image_url: '',
      price_varejo: 0,
      price_revenda: 0,
      specs: '',
      is_active: true
    });
  };

  const handleImageChange = (url: string, field: 'image_url' | 'game_image_url') => {
    setFormData(prev => ({
      ...prev,
      [field]: url
    }));
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gerenciar PCs Prontos</h2>
          <p className="text-muted-foreground">
            Gerencie os PCs prontos da loja
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPc(null); }}>
              <Plus className="h-4 w-4 mr-2" />
              Novo PC Pronto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingPc ? 'Editar PC Pronto' : 'Novo PC Pronto'}
              </DialogTitle>
              <DialogDescription>
                {editingPc ? 'Edite as informações do PC pronto' : 'Adicione um novo PC pronto ao catálogo'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nome do PC</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                  />
                  <Label htmlFor="is_active">Ativo</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="specs">Especificações Técnicas</Label>
                <Textarea
                  id="specs"
                  value={formData.specs}
                  onChange={(e) => setFormData(prev => ({ ...prev, specs: e.target.value }))}
                  rows={4}
                  placeholder="Ex: Processador, Placa de Vídeo, Memória RAM, etc."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price_varejo">Preço Varejo (R$)</Label>
                  <Input
                    id="price_varejo"
                    type="number"
                    step="0.01"
                    value={formData.price_varejo}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_varejo: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="price_revenda">Preço Revenda (R$)</Label>
                  <Input
                    id="price_revenda"
                    type="number"
                    step="0.01"
                    value={formData.price_revenda}
                    onChange={(e) => setFormData(prev => ({ ...prev, price_revenda: parseFloat(e.target.value) }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label>Imagem do PC</Label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(url) => handleImageChange(url, 'image_url')}
                  bucket="ready-pc-images"
                  folder="ready-pcs"
                />
              </div>

              <div>
                <Label>Imagem do Jogo (Opcional)</Label>
                <ImageUpload
                  value={formData.game_image_url}
                  onChange={(url) => handleImageChange(url, 'game_image_url')}
                  bucket="ready-pc-images"
                  folder="games"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PCs Prontos Cadastrados</CardTitle>
          <CardDescription>
            Lista de todos os PCs prontos cadastrados no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Preço Varejo</TableHead>
                <TableHead>Preço Revenda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readyPcs.map((pc) => (
                <TableRow key={pc.id}>
                  <TableCell className="font-medium">{pc.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{pc.description}</TableCell>
                  <TableCell>R$ {pc.price_varejo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {pc.price_revenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      pc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {pc.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(pc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(pc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReadyPcManagement;