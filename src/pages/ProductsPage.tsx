import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductList from '@/components/ProductList';
import ChatBot from '@/components/ChatBot';
import AuthPage from '@/components/Auth/AuthPage';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProductsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  
  // Get search and category from URL params
  const searchTerm = searchParams.get('search') || '';
  const selectedCategory = searchParams.get('categoria') || 'all';

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleSearchChange = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term.trim() !== '') {
      params.set('search', term);
      params.set('categoria', 'all'); // Reset category when searching
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };
  
  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams);
    if (category !== 'all') {
      params.set('categoria', category);
      params.delete('search'); // Clear search when selecting category
    } else {
      params.delete('categoria');
      params.delete('search');
    }
    setSearchParams(params);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (showAuth) {
    return <AuthPage onBack={() => setShowAuth(false)} />;
  }

  if (showAdmin) {
    return <AdminDashboard onBack={() => setShowAdmin(false)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAuthClick={() => setShowAuth(true)}
        onAdminClick={() => setShowAdmin(true)}
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
      />
      
      <div className="bg-white min-h-screen">
        <main className="container mx-auto px-4 py-8">
          {/* Botão Voltar */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar à página principal
            </Button>
          </div>
          
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {searchTerm ? `Resultados para "${searchTerm}"` : 
               selectedCategory !== 'all' ? 'Produtos por Categoria' : 'Todos os Produtos'}
            </h1>
          </div>
          
          <ProductList
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
          />
        </main>
      </div>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default ProductsPage;