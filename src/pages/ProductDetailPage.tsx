import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabasePublic as supabase } from '@/integrations/supabase/publicClient';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import AuthPage from '@/components/Auth/AuthPage';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { useAuth } from '@/contexts/AuthContext';
import { useStoreCredentials } from '@/hooks/useStoreCredentials';
import { ArrowLeft, MessageCircle, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface Product {
  id: string;
  name: string;
  description: string;
  price_varejo: number;
  price_revenda: number;
  image_url: string;
  category_id: string;
  category?: {
    name: string;
  };
}

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const { user, profile } = useAuth();
  const { redirectToWhatsApp } = useStoreCredentials();

  useEffect(() => {
    if (id) {
      fetchProduct(id);
    }
  }, [id]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll automático para o conteúdo do produto
  useEffect(() => {
    if (!loading && product) {
      // Scroll para a seção da imagem do produto
      const productSection = document.querySelector('.grid.md\\:grid-cols-2');
      if (productSection) {
        productSection.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  }, [loading, product]);

  const fetchProduct = async (productId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(name)
        `)
        .eq('id', productId)
        .single();

      if (error) {
        console.error('Error fetching product:', error);
        setProduct(null);
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const getPrice = () => {
    if (!product) return 0;
    if (user && profile?.setor === 'revenda') {
      return product.price_revenda;
    }
    return product.price_varejo;
  };

  const getPriceLabel = () => {
    if (user && profile?.setor === 'revenda') {
      return 'Preço Revenda';
    }
    return 'Preço Varejo';
  };

  const handleWhatsAppContact = () => {
    if (!product) return;
    
    const price = getPrice();
    const message = `Olá! Tenho interesse no produto: *${product.name}*\nPreço: R$ ${price.toFixed(2)}`;
    
    redirectToWhatsApp(message);
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
  const toggleImageZoom = () => setImageZoom(!imageZoom);

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onAuthClick={() => setShowAuth(true)}
          onAdminClick={() => setShowAdmin(true)}
          searchTerm=""
          selectedCategory="all"
          onSearchChange={() => {}}
          onCategoryChange={() => {}}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-48" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-square w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
        
        <Footer />
        <ChatBot />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header
          onAuthClick={() => setShowAuth(true)}
          onAdminClick={() => setShowAdmin(true)}
          searchTerm=""
          selectedCategory="all"
          onSearchChange={() => {}}
          onCategoryChange={() => {}}
        />
        
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Produto não encontrado</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar à página principal
            </Button>
          </div>
        </div>
        
        <Footer />
        <ChatBot />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAuthClick={() => setShowAuth(true)}
        onAdminClick={() => setShowAdmin(true)}
        searchTerm=""
        selectedCategory="all"
        onSearchChange={() => {}}
        onCategoryChange={() => {}}
      />
      
      <div className="container mx-auto px-4 py-8">
        {/* Botão Voltar */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Imagem do produto */}
          <div className="space-y-4">
            <div 
              className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-zoom-in group"
              onClick={toggleImageZoom}
            >
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          {/* Detalhes do produto */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {product.category && (
                  <Badge variant="secondary">{product.category.name}</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{getPriceLabel()}</p>
                    <p className="text-3xl font-bold text-primary">
                      R$ {getPrice().toFixed(2)}
                    </p>
                  </div>

                  <Button 
                    onClick={handleWhatsAppContact}
                    className="w-full bg-green-500 hover:bg-green-600 text-white"
                    size="lg"
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Entrar em contato via WhatsApp
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de zoom da imagem */}
      <Dialog open={imageZoom} onOpenChange={setImageZoom}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-2">
          <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-200"
              style={{ transform: `scale(${zoomLevel})` }}
            />
            
            {/* Controles de zoom */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ProductDetailPage;