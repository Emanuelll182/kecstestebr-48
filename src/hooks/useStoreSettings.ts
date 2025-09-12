import { useState, useEffect } from 'react';

interface StoreSettings {
  enable_sales: boolean;
}

const SETTINGS_STORAGE_KEY = 'kecinforstore_settings';

export const useStoreSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
    
    // Listen for settings changes
    const handleSettingsChange = (event: CustomEvent) => {
      setSettings(event.detail);
    };
    
    window.addEventListener('storeSettingsChanged', handleSettingsChange as EventListener);
    
    return () => {
      window.removeEventListener('storeSettingsChanged', handleSettingsChange as EventListener);
    };
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
        // Default settings if none exist
        setSettings({ enable_sales: false });
        console.log('📝 No settings found, using defaults');
      }
    } catch (error) {
      console.error('❌ Unexpected error:', error);
      setSettings({ enable_sales: false });
    } finally {
      setLoading(false);
    }
  };

  const refreshSettings = () => {
    setLoading(true);
    fetchSettings();
  };

  return {
    settings,
    loading,
    refreshSettings,
    salesEnabled: settings?.enable_sales || false
  };
};