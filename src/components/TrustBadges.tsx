import { Shield, CreditCard, Users } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div className="bg-gradient-primary text-primary-foreground py-5 mb-8">
      <div className="container mx-auto px-1">
        {/* 2 colunas no celular, 4 no desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Compra Segura</h3>
              <p className="text-xs opacity-90">SSL & Certificações</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Parcele em 12x</h3>
              <p className="text-xs opacity-90">Com acréscimo da taxa da maquineta</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">Site Exclusivo</h3>
              <p className="text-xs opacity-90">Ofertas especiais para revendedores</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 text-center">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5" />
            </div>
            <div>
              {/* Termo de Garantia clicável */}
              <a 
                href="/termo-de-garantia" 
                className="font-semibold text-sm underline hover:text-white transition-colors"
              >
                Termo de Garantia
              </a>
              <p className="text-xs opacity-90">Consulte os termos de Garantia</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
