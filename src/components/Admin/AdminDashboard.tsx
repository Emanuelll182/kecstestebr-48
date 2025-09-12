import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Package, Image, Tags, Users, Star, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProductManagement from './ProductManagement';
import BannerManagement from './BannerManagement';
import CategoryManagement from './CategoryManagement';
import ClientManagement from './ClientManagement';
import FeaturedProductsManagement from './FeaturedProductsManagement';
import StoreCredentialsManagement from './StoreCredentialsManagement';
import StoreSettingsManagement from './StoreSettingsManagement';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const { signOut, profile } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const result = await signOut();
    
    if (result.success) {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
      onBack();
    } else {
      toast({
        title: "Erro",
        description: result.error || "Erro ao fazer logout",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              KECINFORSTORE - Admin
            </h1>
            <p className="text-muted-foreground">
              Olá, {profile?.email}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={onBack}>
              Voltar ao Site
            </Button>
            <Button variant="destructive" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Destaques
            </TabsTrigger>
            <TabsTrigger value="banners" className="flex items-center gap-2">
              <Image className="h-4 w-4" />
              Banners
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Tags className="h-4 w-4" />
              Categorias
            </TabsTrigger>
            <TabsTrigger value="clients" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </TabsTrigger>
            <TabsTrigger value="credentials" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Credenciais
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="featured">
            <FeaturedProductsManagement />
          </TabsContent>

          <TabsContent value="banners">
            <BannerManagement />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="clients">
            <ClientManagement />
          </TabsContent>

          <TabsContent value="credentials">
            <StoreCredentialsManagement />
          </TabsContent>

          <TabsContent value="settings">
            <StoreSettingsManagement />
          </TabsContent>

        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;