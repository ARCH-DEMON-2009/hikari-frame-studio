import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Setting {
  id: string;
  key: string;
  value: string;
  description: string;
}

export const SettingsManagement = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('key');

      if (error) throw error;
      setSettings(data || []);
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to fetch settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(settings.map(setting => 
      setting.key === key ? { ...setting, value } : setting
    ));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      for (const setting of settings) {
        const { error } = await supabase
          .from('settings')
          .update({ value: setting.value })
          .eq('key', setting.key);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading settings...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-primary">Settings Management</h2>
        <Button onClick={saveSettings} disabled={saving} className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save All Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => (
          <Card key={setting.id}>
            <CardHeader>
              <CardTitle className="text-lg">{setting.key.replace('_', ' ').toUpperCase()}</CardTitle>
              {setting.description && (
                <p className="text-sm text-muted-foreground">{setting.description}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor={setting.key}>Value</Label>
                <Input
                  id={setting.key}
                  type="number"
                  value={setting.value}
                  onChange={(e) => updateSetting(setting.key, e.target.value)}
                  placeholder="Enter value"
                />
                {setting.key === 'shipping_cost' && (
                  <p className="text-xs text-muted-foreground">Set to 0 for free shipping</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};