import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface StoreSettings {
  enable_sales: boolean;
}

const SETTINGS_STORAGE_KEY = 'kecinforstore_settings';

const StoreSettingsManagement = () => {
  const [settings, setSettings] = useState<StoreSettings>({ enable_sales: false });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      console.log('📡 Loading store settings from localStorage...');
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setSettings(parsedSettings);
        console.log('✅ Settings loaded:', parsedSettings);
      } else {
        console.log('📝 No settings found, using defaults');
      }
    } catch (error) {
      console.error('❌ Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      console.log('💾 Saving settings:', settings);
      
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new CustomEvent('storeSettingsChanged', { detail: settings }));

      toast({
        title: "Sucesso",
        description: "Configurações salvas com sucesso!"
      });

      console.log('✅ Settings saved successfully');
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configurações da Loja</CardTitle>
          <CardDescription>
            Configure as funcionalidades disponíveis na sua loja
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="enable-sales" className="text-base font-medium">
                  Ativar Vendas Online
                </Label>
                <p className="text-sm text-muted-foreground">
                  Permite que clientes adicionem produtos ao carrinho e façam pedidos
                </p>
              </div>
              <Switch
                id="enable-sales"
                checked={settings.enable_sales}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, enable_sales: checked }))
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button 
              onClick={saveSettings} 
              disabled={saving}
              className="w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreSettingsManagement;