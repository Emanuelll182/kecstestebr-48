import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Youtube, 
  Smartphone,
  Shield,
  Truck,
  CreditCard
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background">

      {/* Main footer content */}
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h2 className="text-lg sm:text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2 sm:mb-4">
              Kecinforstore
            </h2>
            <p className="text-background/70 mb-4 sm:mb-6 max-w-md text-sm">
              A maior plataforma de e-commerce do Brasil. Milhões de produtos com entrega rápida e segura para todo o país.
            </p>
            
            {/* Newsletter */}
            <div className="hidden sm:block">
              <h3 className="font-semibold text-background mb-3">Receba ofertas exclusivas</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="Seu e-mail" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/50"
                />
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  Assinar
                </Button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="hidden sm:block">
            <h3 className="font-semibold text-background mb-4">Categorias</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Eletrônicos</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Casa & Decoração</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Moda</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Beleza</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Esportes</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Livros</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="hidden sm:block">
            <h3 className="font-semibold text-background mb-4">Atendimento</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Central de Ajuda</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Meus Pedidos</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Trocas e Devoluções</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Política de Privacidade</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Termos de Uso</a></li>
            </ul>
          </div>

          {/* About */}
          <div className="hidden sm:block">
            <h3 className="font-semibold text-background mb-4">Sobre a Kecinforstore</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Quem Somos</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Trabalhe Conosco</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Investidores</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Sustentabilidade</a></li>
              <li><a href="#" className="text-background/70 hover:text-background transition-colors text-sm">Imprensa</a></li>
            </ul>
          </div>
        </div>
      </div>

      <Separator className="bg-background/20" />

      {/* Bottom footer */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-4">
          <p className="text-background/70 text-xs sm:text-sm text-center md:text-left">
            © 2025 Kecinforstore. Todos os direitos reservados.
          </p>
          
          {/* Social media */}
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="text-background/70 text-xs sm:text-sm mr-1 sm:mr-2 hidden sm:inline">Siga-nos:</span>
            <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10 w-8 h-8">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10 w-8 h-8">
              <Instagram className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10 w-8 h-8">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-background/70 hover:text-background hover:bg-background/10 w-8 h-8">
              <Youtube className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
