import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Monitor, Cpu, HardDrive, Mouse, Keyboard, ArrowRight } from 'lucide-react';

const PCBuilderCTA = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/monte-seu-pc');
  };

  return (
    <section className="py-16 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Monte seu PC dos Sonhos
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Configure seu computador passo a passo, escolhendo cada componente 
              de acordo com suas necessidades e orçamento
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
            {[
              { icon: Monitor, label: 'Gabinete', color: 'text-blue-500' },
              { icon: Cpu, label: 'Processador', color: 'text-green-500' },
              { icon: HardDrive, label: 'Armazenamento', color: 'text-purple-500' },
              { icon: Mouse, label: 'Mouse', color: 'text-orange-500' },
              { icon: Keyboard, label: 'Teclado', color: 'text-pink-500' }
            ].map((item, index) => (
              <Card key={index} className="bg-card/50 border-0 shadow-sm hover:shadow-card transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <item.icon className={`w-8 h-8 mx-auto mb-2 ${item.color}`} />
                  <p className="text-sm font-medium">{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2">Passo a passo</h3>
              <p className="text-sm text-muted-foreground">
                Guia completo para não errar na escolha dos componentes
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="font-semibold mb-2">Preços especiais</h3>
              <p className="text-sm text-muted-foreground">
                Valores diferenciados para revenda e varejo
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="font-semibold mb-2">Orçamento direto</h3>
              <p className="text-sm text-muted-foreground">
                Receba o orçamento completo pelo WhatsApp
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleNavigate}
            size="lg"
            className="text-lg px-8 py-6 shadow-elegant hover:shadow-glow transition-all duration-300"
          >
            Começar a montar meu PC
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <p className="text-sm text-muted-foreground mt-4">
            ✨ Ferramenta 100% gratuita • Sem compromisso
          </p>
        </div>
      </div>
    </section>
  );
};

export default PCBuilderCTA;