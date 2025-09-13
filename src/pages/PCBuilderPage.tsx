import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthWrapper } from '@/components/Auth/AuthWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Cpu, 
  MemoryStick, 
  HardDrive, 
  Monitor, 
  PcCase, 
  Power,
  Fan,
  CircuitBoard,
  Search,
  Filter,
  ShoppingCart,
  MessageCircle,
  ArrowLeft
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  price_varejo: number;
  price_revenda: number;
  image_url?: string;
  category?: string;
  description?: string;
}

interface PcComponent {
  category: string;
  icon: React.ComponentType<any>;
  label: string;
  required: boolean;
  selectedProduct?: Product;
}

const PcBuilderPage = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('processador');
  const [activeTab, setActiveTab] = useState('monte-seu-pc'); // novo estado para abas
  const [products, setProducts] = useState<Product[]>([]);
  const [readyPcs, setReadyPcs] = useState<any[]>([]); // novo estado para PCs prontos
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [pcComponents, setPcComponents] = useState<PcComponent[]>([
    { category: 'processador', icon: Cpu, label: 'Processador', required: true },
    { category: 'placa-mae', icon: CircuitBoard, label: 'Placa Mãe', required: true },
    { category: 'memoria', icon: MemoryStick, label: 'Memória', required: true },
    { category: 'placa-de-video', icon: Monitor, label: 'Placa de Vídeo', required: false },
    { category: '	hdssd', icon: HardDrive, label: 'SSD', required: true },
    { category: '	hd', icon: HardDrive, label: 'HD', required: false },
    { category: 'fonte', icon: Power, label: 'Fonte', required: true },
    { category: 'gabinete', icon: PcCase, label: 'Gabinete', required: true },
    { category: 'cooler', icon: Fan, label: 'Cooler', required: false },
  ]);

  const fetchProductsByCategory = async (category: string) => {
    setLoading(true);
    try {
      // First, find the category ID by slug/name
      const { data: categories, error: categoryError } = await supabase
        .from('categories')
        .select('id, slug, name')
        .or(`slug.ilike.%${category}%,name.ilike.%${category}%`);

      if (categoryError) throw categoryError;

      let query = supabase
        .from('products')
        .select('*');

      // If we found matching categories, filter by category_id
      if (categories && categories.length > 0) {
        const categoryIds = categories.map(cat => cat.id);
        query = query.in('category_id', categoryIds);
      }

      // Also search by product name if there's a search term
      if (searchTerm.trim()) {
        query = query.ilike('name', `%${searchTerm}%`);
      }

      const { data, error } = await query.limit(20);

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os produtos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchReadyPcs = async () => {
    setLoading(true);
    try {
      // Use a simple fetch for now since the table doesn't exist yet
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

  useEffect(() => {
    if (activeTab === 'monte-seu-pc') {
      fetchProductsByCategory(selectedCategory);
    } else {
      fetchReadyPcs();
    }
  }, [selectedCategory, searchTerm, activeTab]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchTerm('');
  };

  const handleProductSelect = (product: Product) => {
    setPcComponents(prev => 
      prev.map(comp => 
        comp.category === selectedCategory 
          ? { ...comp, selectedProduct: product }
          : comp
      )
    );
    
    toast({
      title: "Componente adicionado",
      description: `${product.name} foi adicionado ao seu PC`,
    });
  };

  const handleWhatsAppContact = () => {
    const selectedComponents = pcComponents.filter(comp => comp.selectedProduct);
    const componentsList = selectedComponents.map(comp => 
      `${comp.label}: ${comp.selectedProduct?.name}`
    ).join('\n');
    
    const message = `Olá! Gostaria de montar um PC com os seguintes componentes:\n\n${componentsList}\n\nPoderia me ajudar com um orçamento?`;
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleReadyPcWhatsApp = (readyPc: any) => {
    const { user, profile } = useAuth();
    const price = profile?.setor === 'revenda' ? readyPc.price_revenda : readyPc.price_varejo;
    
    const message = `Olá! Tenho interesse no PC Pronto: ${readyPc.name}\n\nPreço: R$ ${price?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}\n\nPoderia me dar mais informações?`;
    const phone = profile?.setor === 'revenda' ? '558589070724' : '558534833373';
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getTotalPrice = () => {
    return pcComponents.reduce((total, comp) => {
      if (comp.selectedProduct) {
        return total + comp.selectedProduct.price_varejo;
      }
      return total;
    }, 0);
  };

  const getCompletionPercentage = () => {
    const selectedCount = pcComponents.filter(comp => comp.selectedProduct).length;
    return Math.round((selectedCount / pcComponents.length) * 100);
  };

  const currentCategoryData = pcComponents.find(comp => comp.category === selectedCategory);

  return (
    <AuthWrapper>
      <div className="min-h-screen bg-background">
        <Header
          onAuthClick={() => navigate('/auth')}
          onAdminClick={() => navigate('/admin')}
          searchTerm=""
          selectedCategory="all"
          onSearchChange={() => {}}
          onCategoryChange={() => {}}
        />
        
          <div className="container mx-auto px-4 py-6">
          {/* Header com botão voltar e abas */}
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold">Monte seu PC</h1>
          </div>

          {/* Abas */}
          <div className="flex gap-4 mb-6">
            <Button
              variant={activeTab === 'monte-seu-pc' ? 'default' : 'outline'}
              onClick={() => setActiveTab('monte-seu-pc')}
              className="flex items-center gap-2"
            >
              <PcCase className="h-4 w-4" />
              Monte seu PC
            </Button>
            <Button
              variant={activeTab === 'pc-pronto' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pc-pronto')}
              className="flex items-center gap-2"
            >
              <Monitor className="h-4 w-4" />
              PC Pronto
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {activeTab === 'monte-seu-pc' ? (
              <>
                {/* Sidebar esquerda - Categorias */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Componentes</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {pcComponents.map((component) => {
                        const IconComponent = component.icon;
                        const isSelected = component.category === selectedCategory;
                        const hasProduct = !!component.selectedProduct;
                        
                        return (
                          <button
                            key={component.category}
                            onClick={() => handleCategorySelect(component.category)}
                            className={`w-full flex items-center gap-3 p-4 text-left hover:bg-muted/50 transition-colors ${
                              isSelected ? 'bg-primary/10 border-r-2 border-primary' : ''
                            }`}
                          >
                            <div className={`p-2 rounded-lg ${hasProduct ? 'bg-green-100 text-green-600' : 'bg-muted'}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{component.label}</div>
                              {component.required && (
                                <Badge variant="secondary" className="text-xs">Obrigatório</Badge>
                              )}
                              {hasProduct && (
                                <div className="text-xs text-muted-foreground truncate">
                                  {component.selectedProduct?.name}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>

                {/* Área principal - Produtos */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          {currentCategoryData && <currentCategoryData.icon className="h-5 w-5" />}
                          {currentCategoryData?.label}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-4">
                          {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse flex gap-4 p-4 border rounded-lg">
                              <div className="bg-muted h-20 w-20 rounded"></div>
                              <div className="flex-1">
                                <div className="bg-muted h-4 rounded mb-2"></div>
                                <div className="bg-muted h-4 rounded w-3/4 mb-2"></div>
                                <div className="bg-muted h-6 rounded w-1/4"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : products.length > 0 ? (
                        <div className="space-y-3">
                          {products.map((product) => (
                            <Card key={product.id} className="hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex gap-4 items-center">
                                  {product.image_url && (
                                    <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                                      <img 
                                        src={product.image_url} 
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-medium text-sm mb-2 line-clamp-2">{product.name}</h3>
                                    <div className="text-lg font-bold text-primary mb-2">
                                      R$ {product.price_varejo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                    </div>
                                  </div>
                                  <Button 
                                    onClick={() => handleProductSelect(product)}
                                    size="sm"
                                    className="flex-shrink-0"
                                  >
                                    Adicionar
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Nenhum produto encontrado para esta categoria
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              /* Área principal - PCs Prontos */
              <div className="lg:col-span-3">
                <Card>
                  <CardHeader>
                    <CardTitle>PCs Prontos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                          <Card key={i} className="animate-pulse">
                            <CardContent className="p-4">
                              <div className="bg-muted h-48 rounded mb-3"></div>
                              <div className="bg-muted h-4 rounded mb-2"></div>
                              <div className="bg-muted h-4 rounded w-3/4"></div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : readyPcs.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {readyPcs.map((pc) => (
                          <Card key={pc.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              {pc.image_url && (
                                <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                                  <img 
                                    src={pc.image_url} 
                                    alt={pc.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}
                              <h3 className="font-medium text-sm mb-2 line-clamp-2">{pc.name}</h3>
                              <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{pc.description}</p>
                              <div className="text-lg font-bold text-primary mb-3">
                                R$ {pc.price_varejo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                              <Button 
                                onClick={() => handleReadyPcWhatsApp(pc)}
                                className="w-full"
                                size="sm"
                              >
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Solicitar Orçamento
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        Nenhum PC pronto encontrado
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Sidebar direita - Minhas peças (apenas para Monte seu PC) */}
            {activeTab === 'monte-seu-pc' && (
              <div className="lg:col-span-1">
                <Card className="sticky top-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Minhas peças</CardTitle>
                    <div className="flex items-center gap-2">
                      <Progress value={getCompletionPercentage()} className="flex-1" />
                      <span className="text-sm font-medium">{getCompletionPercentage()}%</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {pcComponents.map((component) => {
                        const IconComponent = component.icon;
                        const hasProduct = !!component.selectedProduct;
                        
                        return (
                          <div key={component.category} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                            <div className={`p-2 rounded ${hasProduct ? 'bg-green-100 text-green-600' : 'bg-muted'}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium">{component.label}</div>
                              {hasProduct ? (
                                <div className="text-xs text-muted-foreground truncate">
                                  {component.selectedProduct?.name}
                                </div>
                              ) : (
                                <div className="text-xs text-muted-foreground">Não selecionado</div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Total:</span>
                        <span className="text-lg font-bold text-primary">
                          R$ {getTotalPrice().toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <Button 
                        onClick={handleWhatsAppContact}
                        className="w-full flex items-center gap-2"
                        disabled={pcComponents.filter(c => c.selectedProduct).length === 0}
                      >
                        <MessageCircle className="h-4 w-4" />
                        Solicitar Orçamento
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        <Footer />
      </div>
    </AuthWrapper>
  );
};

export default PcBuilderPage;