import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';
import AuthPage from '@/components/Auth/AuthPage';
import AdminDashboard from '@/components/Admin/AdminDashboard';
import PCBuilderSteps from '@/components/PCBuilder/PCBuilderSteps';
import PCBuilderSummary from '@/components/PCBuilder/PCBuilderSummary';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface SelectedComponent {
  id: string;
  name: string;
  price_varejo: number;
  price_revenda: number;
  image_url: string | null;
  category: string;
}

const PCBuilderPage = () => {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<SelectedComponent[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleComponentSelect = (component: SelectedComponent) => {
    setSelectedComponents(prev => {
      // Remove any existing component of the same category
      const filtered = prev.filter(c => c.category !== component.category);
      return [...filtered, component];
    });
  };

  const handleComponentRemove = (category: string) => {
    setSelectedComponents(prev => prev.filter(c => c.category !== category));
  };

  const handleStepChange = (step: number) => {
    setCurrentStep(step);
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
        searchTerm=""
        selectedCategory="all"
        onSearchChange={() => {}}
        onCategoryChange={() => {}}
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
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Monte seu PC
            </h1>
            <p className="text-gray-600">
              Siga o passo a passo e monte o PC dos seus sonhos
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Área principal - Steps */}
            <div className="lg:col-span-2">
              <PCBuilderSteps
                currentStep={currentStep}
                onStepChange={handleStepChange}
                onComponentSelect={handleComponentSelect}
                selectedComponents={selectedComponents}
              />
            </div>
            
            {/* Painel lateral - Resumo */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <PCBuilderSummary
                  selectedComponents={selectedComponents}
                  onComponentRemove={handleComponentRemove}
                  onStepChange={handleStepChange}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
      
      <Footer />
      <ChatBot />
    </div>
  );
};

export default PCBuilderPage;