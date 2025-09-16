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
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Pencil, Trash2, Plus, Save, X, Search, ShoppingCart } from 'lucide-react';
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
  components?: ReadyPcComponent[];
}

interface ReadyPcComponent {
  id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  price_varejo: number;
  price_revenda: number;
  image_url?: string;
  category_id?: string;
}

const ReadyPcManagement = () => {
  const { user } = useAuth();
  const [readyPcs, setReadyPcs] = useState<ReadyPc[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPc, setEditingPc] = useState<ReadyPc | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerms, setSearchTerms] = useState<{[categoryId: string]: string}>({});
  const [selectedComponents, setSelectedComponents] = useState<{[categoryId: string]: Product | null}>({});
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
      fetchCategories();
      fetchProducts();
    }
  }, [user]);

    const fetchReadyPcs = async () => {
    setLoading(true);
    try {
      // Use 'as any' to bypass type errors if your Supabase client does not include ready_pcs in its generated types
      const { data, error } = await (supabase as any)
        .from('ready_pcs')
        .select(`
          *,
          components:ready_pc_components(
            *,
            product:products(*)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReadyPcs(data || []);
    } catch (error) {
      console.error('Erro ao buscar PCs prontos:', error);
      toast({ title: "Erro", description: "Não foi possível carregar os PCs prontos", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from('products').select('*').order('name');
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedComponentsArray = Object.values(selectedComponents).filter(Boolean);
      if (selectedComponentsArray.length === 0) {
        toast({ title: "Erro", description: "Selecione pelo menos um componente", variant: "destructive" });
        return;
      }

      let pcData = {
        name: formData.name,
        description: formData.description,
        image_url: formData.image_url,
        game_image_url: formData.game_image_url,
        price_varejo: formData.price_varejo || selectedComponentsArray.reduce((sum, p) => sum + p!.price_varejo, 0),
        price_revenda: formData.price_revenda,
        specs: formData.specs,
        is_active: formData.is_active
      };

      let pcId = editingPc?.id || null;

      if (pcId) {
        // UPDATE PC
        const { error } = await supabase.from('ready_pcs' as any).update(pcData).eq('id', pcId);
        if (error) throw error;

        // Remove componentes antigos e insere os novos
        await (supabase as any).from('ready_pc_components').delete().eq('ready_pc_id', pcId);
        const componentsToInsert = selectedComponentsArray.map((product) => ({
          ready_pc_id: pcId,
          product_id: product!.id,
          quantity: 1
        }));
        await (supabase as any).from('ready_pc_components').insert(componentsToInsert);
      } else {
        // CREATE PC
        const { data, error } = await (supabase as any).from('ready_pcs').insert(pcData).select().single();
        if (error) throw error;
        pcId = String(data.id);
        const componentsToInsert = selectedComponentsArray.map((product) => ({
          ready_pc_id: pcId,
          product_id: product!.id,
          quantity: 1
        }));
        await (supabase as any).from('ready_pc_components').insert(componentsToInsert);
      }

      toast({ title: "Sucesso", description: editingPc ? "PC pronto atualizado" : "PC pronto criado" });
      setIsDialogOpen(false);
      setEditingPc(null);
      resetForm();
      fetchReadyPcs();
    } catch (error) {
      console.error('Erro ao salvar PC pronto:', error);
      toast({ title: "Erro", description: "Não foi possível salvar o PC pronto", variant: "destructive" });
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

    const existingComponents: {[categoryId: string]: Product | null} = {};
    pc.components?.forEach(comp => {
      if (comp.product?.category_id) existingComponents[comp.product.category_id] = comp.product;
    });
    setSelectedComponents(existingComponents);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este PC pronto?')) return;
    try {
      await supabase.from('ready_pc_components' as any).delete().eq('ready_pc_id', id);
      await supabase.from('ready_pcs' as any).delete().eq('id', id);
      toast({ title: "Sucesso", description: "PC pronto excluído" });
      fetchReadyPcs();
    } catch (error) {
      console.error('Erro ao excluir PC pronto:', error);
      toast({ title: "Erro", description: "Não foi possível excluir o PC pronto", variant: "destructive" });
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', image_url: '', game_image_url: '', price_varejo: 0, price_revenda: 0, specs: '', is_active: true });
    setSelectedComponents({});
    setSearchTerms({});
  };

  const handleImageChange = (url: string, field: 'image_url' | 'game_image_url') => {
    setFormData(prev => ({ ...prev, [field]: url }));
  };

  const handleComponentSelect = (categoryId: string, product: Product) => {
    setSelectedComponents(prev => ({ ...prev, [categoryId]: product }));
  };

  const handleComponentRemove = (categoryId: string) => {
    const newSelected = { ...selectedComponents };
    delete newSelected[categoryId];
    setSelectedComponents(newSelected);
  };

  const getFilteredProducts = (categoryId: string) => {
    const searchTerm = searchTerms[categoryId] || '';
    return products.filter(product => product.category_id === categoryId && product.name.toLowerCase().includes(searchTerm.toLowerCase()));
  };

  const getTotalPrice = () => Object.values(selectedComponents).reduce((sum, p) => sum + (p?.price_varejo || 0), 0);

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gerenciar PCs Prontos</h2>
          <p className="text-muted-foreground">Gerencie os PCs prontos da loja</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { resetForm(); setEditingPc(null); }}>
              <Plus className="h-4 w-4 mr-2" /> Novo PC Pronto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPc ? 'Editar PC Pronto' : 'Novo PC Pronto'}</DialogTitle>
              <DialogDescription>{editingPc ? 'Edite as informações do PC pronto' : 'Adicione um novo PC pronto ao catálogo'}</DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">Informações</TabsTrigger>
                <TabsTrigger value="components">Componentes</TabsTrigger>
                <TabsTrigger value="images">Imagens</TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Informações */}
                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome do PC</Label>
                      <Input id="name" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} required />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="is_active" checked={formData.is_active} onCheckedChange={checked => setFormData(prev => ({ ...prev, is_active: checked }))} />
                      <Label htmlFor="is_active">Ativo</Label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} rows={3} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price_varejo">Preço Varejo (R$)</Label>
                      <Input id="price_varejo" type="number" step="0.01" value={formData.price_varejo} onChange={e => setFormData(prev => ({ ...prev, price_varejo: parseFloat(e.target.value) }))} placeholder={`Automático: R$ ${getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
                    </div>
                    <div>
                      <Label htmlFor="price_revenda">Preço Revenda (R$)</Label>
                      <Input id="price_revenda" type="number" step="0.01" value={formData.price_revenda} onChange={e => setFormData(prev => ({ ...prev, price_revenda: parseFloat(e.target.value) }))} required />
                    </div>
                  </div>
                </TabsContent>

                {/* Componentes */}
                <TabsContent value="components" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Componentes Selecionados</h4>
                      <div className="text-sm text-muted-foreground">Total: R$ {getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    </div>
                    {Object.entries(selectedComponents).length > 0 && (
                      <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
                        {Object.entries(selectedComponents).map(([categoryId, product]) => {
                          if (!product) return null;
                          const category = categories.find(c => c.id === categoryId);
                          return (
                            <div key={categoryId} className="flex items-center justify-between p-2 bg-muted rounded">
                              <div className="flex items-center space-x-2">
                                <Badge variant="secondary">{category?.name}</Badge>
                                <span className="font-medium">{product.name}</span>
                                <span className="text-sm text-muted-foreground">R$ {product.price_varejo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                              </div>
                              <Button type="button" variant="ghost" size="sm" onClick={() => handleComponentRemove(categoryId)}><X className="h-4 w-4" /></Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <Accordion type="single" collapsible className="w-full">
                      {categories.map(category => (
                        <AccordionItem key={category.id} value={category.id}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center justify-between w-full mr-4">
                              <span>{category.name}</span>
                              {selectedComponents[category.id] && <Badge variant="default">Selecionado</Badge>}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3">
                              <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input placeholder={`Buscar em ${category.name}...`} value={searchTerms[category.id] || ''} onChange={e => setSearchTerms(prev => ({ ...prev, [category.id]: e.target.value }))} className="pl-10" />
                              </div>
                              <div className="max-h-60 overflow-y-auto space-y-2">
                                {getFilteredProducts(category.id).map(product => (
                                  <div key={product.id} className={`flex items-center justify-between p-3 border rounded cursor-pointer hover:bg-muted ${selectedComponents[category.id]?.id === product.id ? 'ring-2 ring-primary' : ''}`} onClick={() => handleComponentSelect(category.id, product)}>
                                    <div className="flex items-center space-x-3">
                                      {product.image_url && <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded" />}
                                      <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-sm text-muted-foreground">R$ {product.price_varejo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                                      </div>
                                    </div>
                                    {selectedComponents[category.id]?.id === product.id && <ShoppingCart className="h-4 w-4 text-primary" />}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </TabsContent>

                {/* Imagens */}
                <TabsContent value="images" className="space-y-4">
                  <div>
                    <Label>Imagem do PC</Label>
                    <ImageUpload value={formData.image_url} onChange={url => handleImageChange(url, 'image_url')} bucket="ready-pc-images" folder="ready-pcs" />
                  </div>
                  <div>
                    <Label>Imagem do Jogo (Opcional)</Label>
                    <ImageUpload value={formData.game_image_url} onChange={url => handleImageChange(url, 'game_image_url')} bucket="ready-pc-images" folder="games" />
                  </div>
                </TabsContent>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}><X className="h-4 w-4 mr-2" />Cancelar</Button>
                  <Button type="submit"><Save className="h-4 w-4 mr-2" />Salvar</Button>
                </div>
              </form>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PCs Prontos Cadastrados</CardTitle>
          <CardDescription>Lista de todos os PCs prontos cadastrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Componentes</TableHead>
                <TableHead>Preço Varejo</TableHead>
                <TableHead>Preço Revenda</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {readyPcs.map(pc => (
                <TableRow key={pc.id}>
                  <TableCell className="font-medium">{pc.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{pc.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {pc.components?.map(comp => {
                        const category = categories.find(c => c.id === comp.product?.category_id);
                        return <Badge key={comp.id} variant="secondary" className="text-xs">{category?.name || 'N/A'}</Badge>;
                      })}
                    </div>
                  </TableCell>
                  <TableCell>R$ {pc.price_varejo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell>R$ {pc.price_revenda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                  <TableCell><span className={`px-2 py-1 rounded-full text-xs ${pc.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{pc.is_active ? 'Ativo' : 'Inativo'}</span></TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleEdit(pc)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(pc.id)}><Trash2 className="h-4 w-4" /></Button>
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
