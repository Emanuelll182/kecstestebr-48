import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  ShoppingBag, Shirt, Smartphone, Home, Car, 
  Book, Music, Camera, Gamepad2, Coffee, Pizza, Dumbbell, Palette,
  Laptop, Watch, Gem, Plane, TreePine, Baby, Heart, Star,
  Cpu, HardDrive, MemoryStick, PcCase, Monitor, Headphones,
  Mouse, Keyboard, Printer, Server, Wifi, Bluetooth,
  Router, Gamepad, Tablet, SmartphoneCharging, Battery, BatteryLow,
  BatteryFull, Plug, Power, PowerOff, Zap, Usb,
  CreditCard, Disc, Disc3, Projector, Speaker, Microchip,
  Fan, Database, Cloud, Settings,
  Shield, Lock, Unlock, Key, Fingerprint, QrCode, Barcode,
  Timer, Clock, AlarmClock, Calendar, Bell, BellRing,
  Mail, MessageCircle, Phone as PhoneIcon, Video, VideoOff,
  Mic, MicOff, Volume, PlayCircle, PauseCircle,
  StopCircle, SkipBack, SkipForward, Repeat, Shuffle, Cable
} from "lucide-react";
import { supabasePublic as supabase } from '@/integrations/supabase/publicClient';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  show_in_explore?: boolean;
  icon_symbol?: string;
}

interface CategoriesSectionProps {
  onCategorySelect?: (categorySlug: string) => void;
}

// Função para obter o ícone da categoria
const getCategoryIcon = (iconSymbol?: string) => {
  switch (iconSymbol) {
    case 'ShoppingBag': return ShoppingBag;
    case 'Shirt': return Shirt;
    case 'Smartphone': return Smartphone;
    case 'Home': return Home;
    case 'Car': return Car;
    case 'Book': return Book;
    case 'Music': return Music;
    case 'Camera': return Camera;
    case 'Gamepad2': return Gamepad2;
    case 'Coffee': return Coffee;
    case 'Pizza': return Pizza;
    case 'Dumbbell': return Dumbbell;
    case 'Palette': return Palette;
    case 'Laptop': return Laptop;
    case 'Watch': return Watch;
    case 'Gem': return Gem;
    case 'Plane': return Plane;
    case 'TreePine': return TreePine;
    case 'Baby': return Baby;
    case 'Heart': return Heart;
    case 'Star': return Star;
    case 'Cpu': return Cpu;
    case 'HardDrive': return HardDrive;
    case 'MemoryStick': return MemoryStick;
    case 'PcCase': return PcCase;
    case 'Monitor': return Monitor;
    case 'Headphones': return Headphones;
    case 'Mouse': return Mouse;
    case 'Keyboard': return Keyboard;
    case 'Printer': return Printer;
    case 'Server': return Server;
    case 'Wifi': return Wifi;
    case 'Bluetooth': return Bluetooth;
    case 'Router': return Router;
    case 'Gamepad': return Gamepad;
    case 'Tablet': return Tablet;
    case 'SmartphoneCharging': return SmartphoneCharging;
    case 'Battery': return Battery;
    case 'BatteryLow': return BatteryLow;
    case 'BatteryFull': return BatteryFull;
    case 'Plug': return Plug;
    case 'Cable': return Cable;
    case 'Power': return Power;
    case 'PowerOff': return PowerOff;
    case 'Zap': return Zap;
    case 'Usb': return Usb;
    case 'CreditCard': return CreditCard;
    case 'Disc': return Disc;
    case 'Disc3': return Disc3;
    case 'Projector': return Projector;
    case 'Speaker': return Speaker;
    case 'Microchip': return Microchip;
    case 'Fan': return Fan;
    case 'HardDrive': return HardDrive;
    case 'Database': return Database;
    case 'Cloud': return Cloud;
    case 'Settings': return Settings;
    case 'Shield': return Shield;
    case 'Lock': return Lock;
    case 'Unlock': return Unlock;
    case 'Key': return Key;
    case 'Fingerprint': return Fingerprint;
    case 'QrCode': return QrCode;
    case 'Barcode': return Barcode;
    case 'Timer': return Timer;
    case 'Clock': return Clock;
    case 'AlarmClock': return AlarmClock;
    case 'Calendar': return Calendar;
    case 'Bell': return Bell;
    case 'BellRing': return BellRing;
    case 'Mail': return Mail;
    case 'MessageCircle': return MessageCircle;
    case 'PhoneIcon': return PhoneIcon;
    case 'Video': return Video;
    case 'VideoOff': return VideoOff;
    case 'Mic': return Mic;
    case 'MicOff': return MicOff;
    case 'Volume': return Volume;
    case 'PlayCircle': return PlayCircle;
    case 'PauseCircle': return PauseCircle;
    case 'StopCircle': return StopCircle;
    case 'SkipBack': return SkipBack;
    case 'SkipForward': return SkipForward;
    case 'Repeat': return Repeat;
    case 'Shuffle': return Shuffle;
    default: return ShoppingBag;
  }
};

const getCategoryColor = (index: number) => {
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-pink-100 text-pink-600",
    "bg-orange-100 text-orange-600",
    "bg-indigo-100 text-indigo-600",
    "bg-red-100 text-red-600",
    "bg-yellow-100 text-yellow-600",
  ];
  return colors[index % colors.length];
};

const CategoriesSection = ({ onCategorySelect }: CategoriesSectionProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
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
        // Filtrar apenas categorias que devem aparecer no explore
        const filteredCategories = (data || []).filter((category: any) => 
          category.show_in_explore === true
        );
        setCategories(filteredCategories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categorySlug: string) => {
    console.log('🔥 Category button clicked:', categorySlug);
    console.log('🔥 onCategorySelect function exists:', !!onCategorySelect);
    
    if (onCategorySelect) {
      console.log('🔥 Calling onCategorySelect...');
      onCategorySelect(categorySlug);
      console.log('🔥 onCategorySelect called successfully');
    }
  };

  if (loading) {
    return (
      <section className="py-6 sm:py-16 bg-secondary/30">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
              Explore nossas categorias
            </h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-2 sm:p-3 md:p-6 text-center">
                  <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-gray-200 animate-pulse mx-auto mb-1 sm:mb-2 md:mb-4" />
                  <div className="h-2 sm:h-3 md:h-4 bg-gray-200 animate-pulse rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-16 bg-secondary/30">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-xl sm:text-3xl md:text-4xl font-bold text-foreground mb-2 sm:mb-4">
            Explore nossas categorias
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto hidden sm:block">
            Encontre exatamente o que você procura em nossa ampla variedade de produtos
          </p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
          {categories.map((category, index) => {
            const IconComponent = getCategoryIcon(category.icon_symbol);
            const colorClass = getCategoryColor(index);
            
            return (
              <Card 
                key={category.id} 
                className="group cursor-pointer hover:shadow-card transition-all duration-300 hover:-translate-y-1 border-0 shadow-sm notranslate"
                translate="no"
              >
                <CardContent 
                  className="p-2 sm:p-3 md:p-6 text-center notranslate"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🔥 Card clicked, preventing default and calling handler');
                    handleCategoryClick(category.slug);
                  }}
                  role="button"
                  tabIndex={0}
                  translate="no"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategoryClick(category.slug);
                    }
                  }}
                >
                  <div className={`w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full ${colorClass} flex items-center justify-center mx-auto mb-1 sm:mb-2 md:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 md:h-8 md:w-8" />
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors leading-tight">
                    {category.name}
                  </h3>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
