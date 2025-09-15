import { Search, User, LogOut, MessageCircle, Tags, MapPin, PcCase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { useStoreCredentials } from "@/hooks/useStoreCredentials";
import { useState, useEffect } from "react";
import { supabasePublic as supabase } from "@/integrations/supabase/publicClient";
import { SiInstagram, SiFacebook } from "react-icons/si";

const Fotokec = "/kec.png";
interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  onAuthClick: () => void;
  onAdminClick: () => void;
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
}

const Header = ({ 
  onAuthClick, 
  onAdminClick, 
  searchTerm, 
  selectedCategory, 
  onSearchChange, 
  onCategoryChange 
}: HeaderProps) => {
  const { user, profile, signOut } = useAuth();
  const { redirectToWhatsApp, currentSector } = useStoreCredentials();
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeCredentials, setStoreCredentials] = useState<any>(null);

  useEffect(() => {
    fetchCategories();
    fetchStoreCredentials();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Categories error:', error);
        setCategories([]);
      } else {
        setCategories(data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const fetchStoreCredentials = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Store credentials error:', error);
        setStoreCredentials({
          instagram_url: 'https://instagram.com/kecinforstore',
          facebook_url: 'https://facebook.com/kecinforstore'
        });
      } else {
        setStoreCredentials(data);
      }
    } catch (error) {
      console.error('Error fetching store credentials:', error);
      setStoreCredentials({
        instagram_url: 'https://instagram.com/kecinforstore',
        facebook_url: 'https://facebook.com/kecinforstore'
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-background border-b sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-gradient-primary text-primary-foreground py-2">
        <div className="container mx-auto px-auto">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-4 text-sm">
              <span>Os melhores produtos em tecnologia • Preços especiais para revenda</span>
            </div>
            
            {/* Endereço + Redes sociais */}
            <div className="flex items-center gap-3 text-sm w-full md:w-auto justify-center md:justify-end">
              <a 
                href="https://maps.app.goo.gl/NCvPUnHPzWJJoPqZ7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <MapPin className="h-5 w-5" />
                <span className="hidden sm:inline">Endereço da Loja</span>
              </a>

              {/* Botão Instagram */}
              <a 
                href={storeCredentials?.instagram_url || "https://instagram.com/kecinforstore"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <SiInstagram className="h-4 w-4" />
              </a>

              {/* Botão Facebook */}
              <a 
                href={storeCredentials?.facebook_url || "https://www.facebook.com/KECvendas/?locale=pt_BR"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:opacity-80 transition-opacity"
              >
                <SiFacebook className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-auto py-auto">
        <div className="flex items-center justify-between gap-1">
          {/* Logo */}
          <div className="flex items-center">
            <a href="https://kecs.com.br" className="flex items-center">
              <img
                src={Fotokec}
                alt="KECINFORSTORE Logo"
                className="h-auto sm:h-24 w-70 animate-fade-in"
              />
            </a>
          </div>

          {/* Search and Filters */}
          <div className="flex-auto max-w-auto mx-auto">
            <div className="flex gap-1 sm:gap-6">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => {
                    console.log('🔍 Search input changed:', e.target.value);
                    onSearchChange(e.target.value);
                  }}
                  className="pl-7 sm:pl-10 h-8 sm:h-10 text-sm placeholder:text-xs sm:placeholder:text-sm touch-manipulation"
                  autoComplete="on"
                  autoCorrect="on"
                  autoCapitalize="on"
                  spellCheck="true"
                />
              </div>

              {/* Category Filter */}
              <div className="w-8 sm:min-w-[140px]">
                <Select 
                  value={selectedCategory} 
                  onValueChange={(value) => {
                    console.log('🏷️ Category selected in header:', value);
                    onCategoryChange(value);
                  }}
                >
                  <SelectTrigger className="h-8 sm:h-10 w-8 sm:w-auto px-1 sm:px-3 touch-manipulation">
                    <div className="flex items-center">
                      <Tags className="h-auto w-auto sm:h-4 sm:w-4" />
                      <SelectValue className="hidden sm:block ml-2" placeholder="Categorias" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-md z-50 max-h-60 overflow-y-auto">
                    <SelectItem value="all"></SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center gap-1 sm:gap-2">

            
            {/* WhatsApp Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => redirectToWhatsApp()}
              className="bg-green-500 hover:bg-green-600 text-white border-green-500 w-8 h-8 sm:w-auto sm:h-auto p-1 sm:px-3 sm:py-2"
            >
              <MessageCircle className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
              <span className="hidden sm:inline">WhatsApp {currentSector === 'revenda' ? 'Revenda' : 'Varejo'}</span>
            </Button>
            
            {user && profile ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {profile.is_admin && (
                  <Button variant="outline" size="sm" onClick={onAdminClick} className="hidden sm:inline-flex">
                    Painel Admin
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-8 h-8 sm:w-auto sm:h-auto p-1 sm:px-3 sm:py-2">
                  <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline ml-2">Sair</span>
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                onClick={onAuthClick}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground touch-manipulation w-8 h-8 sm:w-auto sm:h-auto p-1 sm:px-3 sm:py-2"
              >
                <User className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden sm:inline">Login Revenda</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


