import { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, ShoppingBag, Shirt, Smartphone, Home, Car, 
  Book, Music, Camera, Gamepad2, Coffee, Pizza, Dumbbell, Palette,
  Laptop, Watch, Gem, Plane, TreePine, Baby, Heart, Star,
  Cpu, HardDrive, Monitor, Keyboard, Mouse, Headphones, Speaker,
  Wifi, Bluetooth, Usb, Battery, Plug, Zap, Settings, Cog,
  Server, Database, Cloud, Code, Terminal, Computer, Smartphone as Phone,
  Tablet, Webcam, Printer, HardHat, Router, Microchip, MemoryStick,
  HardDriveIcon, Disc, MonitorSpeaker, Projector, Gamepad,
  VolumeX, Volume1, Volume2, Radio, Tv, Satellite, Radar,
  Joystick, MousePointer, TouchpadOff, Power, PowerOff, RotateCcw,
  RefreshCw, Download, Upload, Share, Link, WifiOff, BluetoothConnected,
  UsbIcon, BatteryLow, BatteryFull, Lightbulb, Flashlight, Sun,
  Moon, Eye, EyeOff, Lock, Unlock, Shield, ShieldCheck,
  Key, Fingerprint, QrCode, Barcode, Timer, Clock, AlarmClock,
  Calendar, Bell, BellRing, Mail, MessageCircle, Phone as PhoneIcon,
  Video, VideoOff, MicIcon, MicOff, VolumeIcon, PlayCircle,
  PauseCircle, StopCircle, SkipBack, SkipForward, Repeat, Shuffle,
  Cable
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  show_in_explore?: boolean;
  icon_symbol?: string;
}

// Ícones disponíveis para as categorias - 80 símbolos de tecnologia
const availableIcons = [
  // Componentes de Hardware
  { name: 'Cpu', icon: Cpu, label: 'Processador' },
  { name: 'HardDrive', icon: HardDrive, label: 'HD/SSD' },
  { name: 'MemoryStick', icon: MemoryStick, label: 'Memória RAM' },
  { name: 'Monitor', icon: Monitor, label: 'Monitor' },
  { name: 'Computer', icon: Computer, label: 'Gabinete' },
  { name: 'Laptop', icon: Laptop, label: 'Notebook' },
  { name: 'Tablet', icon: Tablet, label: 'Tablet' },
  { name: 'Smartphone', icon: Smartphone, label: 'Smartphone' },
  
  // Periféricos
  { name: 'Keyboard', icon: Keyboard, label: 'Teclado' },
  { name: 'Mouse', icon: Mouse, label: 'Mouse' },
  { name: 'MousePointer', icon: MousePointer, label: 'Ponteiro' },
  { name: 'Headphones', icon: Headphones, label: 'Fones de Ouvido' },
  { name: 'Speaker', icon: Speaker, label: 'Alto-falantes' },
  { name: 'MonitorSpeaker', icon: MonitorSpeaker, label: 'Caixas de Som' },
  { name: 'Webcam', icon: Webcam, label: 'Webcam' },
  { name: 'Camera', icon: Camera, label: 'Câmera' },
  { name: 'MicIcon', icon: MicIcon, label: 'Microfone' },
  { name: 'Projector', icon: Projector, label: 'Projetor' },
  
  // Dispositivos de Entrada/Saída
  { name: 'Printer', icon: Printer, label: 'Impressora' },
  { name: 'HardHat', icon: HardHat, label: 'Scanner' },
  { name: 'UsbIcon', icon: UsbIcon, label: 'USB' },
  { name: 'HardDriveIcon', icon: HardDriveIcon, label: 'Cartão SD' },
  { name: 'Disc', icon: Disc, label: 'CD/DVD' },
  
  // Conectividade
  { name: 'Wifi', icon: Wifi, label: 'Wi-Fi' },
  { name: 'WifiOff', icon: WifiOff, label: 'Sem Wi-Fi' },
  { name: 'Bluetooth', icon: Bluetooth, label: 'Bluetooth' },
  { name: 'BluetoothConnected', icon: BluetoothConnected, label: 'Bluetooth Conectado' },
  { name: 'Router', icon: Router, label: 'Roteador' },
  { name: 'Satellite', icon: Satellite, label: 'Satélite' },
  { name: 'Radar', icon: Radar, label: 'Radar' },
  { name: 'Link', icon: Link, label: 'Link' },
  
  // Energia e Alimentação
  { name: 'Battery', icon: Battery, label: 'Bateria' },
  { name: 'BatteryLow', icon: BatteryLow, label: 'Bateria Baixa' },
  { name: 'BatteryFull', icon: BatteryFull, label: 'Bateria Cheia' },
  { name: 'Plug', icon: Plug, label: 'Fonte de PC' },
  { name: 'Cable', icon: Cable, label: 'Carregador de Celular' },
  { name: 'Power', icon: Power, label: 'Carregador de Notebook' },
  { name: 'PowerOff', icon: PowerOff, label: 'Desligar' },
  { name: 'Zap', icon: Zap, label: 'Energia' },
  
  // Software e Sistema
  { name: 'Code', icon: Code, label: 'Programação' },
  { name: 'Terminal', icon: Terminal, label: 'Terminal' },
  { name: 'Settings', icon: Settings, label: 'Configurações' },
  { name: 'Cog', icon: Cog, label: 'Engrenagem' },
  { name: 'Database', icon: Database, label: 'Banco de Dados' },
  { name: 'Server', icon: Server, label: 'Servidor' },
  { name: 'Cloud', icon: Cloud, label: 'Nuvem' },
  
  // Gaming
  { name: 'Gamepad2', icon: Gamepad2, label: 'Controle' },
  { name: 'Gamepad', icon: Gamepad, label: 'Joystick' },
  { name: 'Joystick', icon: Joystick, label: 'Joystick Analógico' },
  
  // Áudio e Vídeo
  { name: 'Music', icon: Music, label: 'Música' },
  { name: 'VolumeIcon', icon: VolumeIcon, label: 'Volume' },
  { name: 'Volume1', icon: Volume1, label: 'Volume Baixo' },
  { name: 'Volume2', icon: Volume2, label: 'Volume Alto' },
  { name: 'VolumeX', icon: VolumeX, label: 'Mudo' },
  { name: 'PlayCircle', icon: PlayCircle, label: 'Play' },
  { name: 'PauseCircle', icon: PauseCircle, label: 'Pause' },
  { name: 'StopCircle', icon: StopCircle, label: 'Stop' },
  { name: 'SkipBack', icon: SkipBack, label: 'Anterior' },
  { name: 'SkipForward', icon: SkipForward, label: 'Próximo' },
  { name: 'Repeat', icon: Repeat, label: 'Repetir' },
  { name: 'Shuffle', icon: Shuffle, label: 'Aleatório' },
  { name: 'Radio', icon: Radio, label: 'Rádio' },
  { name: 'Tv', icon: Tv, label: 'TV' },
  { name: 'Video', icon: Video, label: 'Vídeo' },
  { name: 'VideoOff', icon: VideoOff, label: 'Vídeo Desligado' },
  { name: 'MicOff', icon: MicOff, label: 'Microfone Mudo' },
  
  // Segurança
  { name: 'Lock', icon: Lock, label: 'Bloqueado' },
  { name: 'Unlock', icon: Unlock, label: 'Desbloqueado' },
  { name: 'Shield', icon: Shield, label: 'Escudo' },
  { name: 'ShieldCheck', icon: ShieldCheck, label: 'Seguro' },
  { name: 'Key', icon: Key, label: 'Chave' },
  { name: 'Fingerprint', icon: Fingerprint, label: 'Biometria' },
  { name: 'QrCode', icon: QrCode, label: 'QR Code' },
  { name: 'Barcode', icon: Barcode, label: 'Código de Barras' },
  
  // Utilitários
  { name: 'Eye', icon: Eye, label: 'Visualizar' },
  { name: 'EyeOff', icon: EyeOff, label: 'Ocultar' },
  { name: 'Download', icon: Download, label: 'Download' },
  { name: 'Upload', icon: Upload, label: 'Upload' },
  { name: 'Share', icon: Share, label: 'Compartilhar' },
  { name: 'RefreshCw', icon: RefreshCw, label: 'Atualizar' },
  { name: 'RotateCcw', icon: RotateCcw, label: 'Desfazer' },
  
  // Tempo e Comunicação
  { name: 'Timer', icon: Timer, label: 'Timer' },
  { name: 'Clock', icon: Clock, label: 'Relógio' },
  { name: 'AlarmClock', icon: AlarmClock, label: 'Cronômetro' },
  { name: 'Calendar', icon: Calendar, label: 'Calendário' },
  { name: 'BellRing', icon: BellRing, label: 'Notificação' },
  { name: 'Mail', icon: Mail, label: 'Email' },
  { name: 'MessageCircle', icon: MessageCircle, label: 'Mensagem' },
  { name: 'PhoneIcon', icon: PhoneIcon, label: 'Telefone' },
  
  // Iluminação
  { name: 'Lightbulb', icon: Lightbulb, label: 'Lâmpada' },
  { name: 'Flashlight', icon: Flashlight, label: 'Lanterna' },
  { name: 'Sun', icon: Sun, label: 'Sol' },
  { name: 'Moon', icon: Moon, label: 'Lua' }
];

const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    show_in_explore: false,
    icon_symbol: 'ShoppingBag'
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      show_in_explore: false,
      icon_symbol: 'ShoppingBag'
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      show_in_explore: category.show_in_explore || false,
      icon_symbol: category.icon_symbol || 'ShoppingBag'
    });
    setIsOpen(true);
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const categoryData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description || null,
        show_in_explore: formData.show_in_explore,
        icon_symbol: formData.icon_symbol
      };

      let error;
      if (editingCategory) {
        ({ error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id));
      } else {
        ({ error } = await supabase
          .from('categories')
          .insert([categoryData]));
      }

      if (error) throw error;

      toast({
        title: editingCategory ? "Categoria atualizada!" : "Categoria criada!",
        description: "Categoria salva com sucesso.",
      });

      fetchCategories();
      setIsOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao salvar a categoria.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Categoria excluída!",
        description: "Categoria removida com sucesso.",
      });

      fetchCategories();
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Ocorreu um erro ao excluir a categoria.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gerenciar Categorias</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="bg-gradient-primary hover:opacity-90">
                <Plus className="h-4 w-4 mr-2" />
                Nova Categoria
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Categoria</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="categoria-exemplo"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Usado na URL. Apenas letras minúsculas, números e hífens.
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Descrição da categoria..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="show_in_explore"
                    checked={formData.show_in_explore}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, show_in_explore: checked }))}
                  />
                  <Label htmlFor="show_in_explore">Exibir na seção "Explore Categorias"</Label>
                </div>

                {formData.show_in_explore && (
                  <div>
                    <Label htmlFor="icon_symbol">Símbolo da Categoria</Label>
                    <Select
                      value={formData.icon_symbol}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, icon_symbol: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um símbolo" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {availableIcons.map((iconData) => {
                          const IconComponent = iconData.icon;
                          return (
                            <SelectItem key={iconData.name} value={iconData.name}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" />
                                <span>{iconData.label}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading} className="bg-gradient-primary hover:opacity-90">
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Explore</TableHead>
              <TableHead>Símbolo</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => {
              const iconData = availableIcons.find(icon => icon.name === category.icon_symbol);
              const IconComponent = iconData?.icon || ShoppingBag;
              
              return (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="font-mono text-sm">{category.slug}</TableCell>
                  <TableCell>{category.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {category.show_in_explore ? (
                        <span className="text-green-600 font-medium">Sim</span>
                      ) : (
                        <span className="text-gray-500">Não</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.show_in_explore && iconData ? (
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm text-muted-foreground">{iconData.label}</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default CategoryManagement;
