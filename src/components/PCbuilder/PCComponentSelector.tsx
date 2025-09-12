import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Check, MessageCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuthGuard';
import { SelectedComponent } from '@/pages/PCBuilderPage';

interface Product {
  id: string;
  name: string;
  price_varejo: number;
  price_revenda: number;
  image_url: string | null;
  description: string | null;
  sku: string | null;
}

interface PCComponentSelectorProps {
  category: string;
  onComponentSelect: (component: Product) => void;
  selectedComponent?: SelectedComponent;
}

const PCComponentSelector = ({
  category,
  onComponentSelect,
  selectedComponent
}: PCComponentSelectorProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { profile } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Busca categoria
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .ilike('name', `%${category}%`)
          .single();

        if (categoryData) {
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .eq('category_id', categoryData.id)
            .limit(20);

          setProducts(productsData || []);
        } else {
          // Fallback: busca por nome
          const { data: productsData } = await supabase
            .from('products')
            .select('*')
            .ilike('name', `%${category.slice(0, -1)}%`)
            .limit(20);

          setProducts(productsData || []);
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const getPrice = (product: Product) => {
    return profile?.setor === 'revenda' ? product.price_revenda : product.price_varejo;
  };

  const handleWhatsAppContact = (product: Product) => {
    const price = getPrice(product);
    const message = `Olá! Tenho interesse no produto:
    
*${product.name}*
Preço: R$ ${price.toFixed(2)}
${product.sku ? `SKU: ${product.sku}` : ''}

Gostaria de mais informações!`;

    const whatsappUrl = `https://wa.me/558534833373?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <Skeleton className="h-32 w-full mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum produto encontrado para esta categoria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {products.map((product) => {
        const price = getPrice(product);
        const isSelected = selectedComponent?.id === product.id;

        return (
          <Card
            key={product.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary' : ''
            }`}
          >
            <CardContent className="p-4">
              {/* Imagem do produto */}
              <div className="aspect-square mb-4 bg-muted rounded-lg overflow-hidden relative">
                <img
                  src={
                    product.image_url ||
                    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop'
                  }
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.sku && (
                  <Badge className="absolute top-2 right-2 bg-blue-500 text-white text-xs">
                    {product.sku}
                  </Badge>
                )}
              </div>

              {/* Informações do produto */}
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {product.name}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="text-lg font-bold text-primary">
                  R$ {price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                {profile?.setor === 'revenda' ? (
                  <div className="text-xs text-green-600 font-medium">
                    Preço Revenda
                  </div>
                ) : (
                  <div className="text-xs text-blue-600 font-medium">
                    Preço Varejo
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex gap-2">
                <Button
                  onClick={() => onComponentSelect(product)}
                  className={`flex-1 ${
                    isSelected ? 'bg-green-600 hover:bg-green-700' : ''
                  }`}
                  size="sm"
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Selecionado
                    </>
                  ) : (
                    'Selecionar'
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWhatsAppContact(product)}
                  className="flex items-center gap-1"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PCComponentSelector;
