import { useSettingsStore } from '@/lib/settingsStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Settings as SettingsIcon, Factory, ShoppingCart, Bell, Plug } from 'lucide-react';

const Settings = () => {
  const { settings, updateSettings, resetSettings } = useSettingsStore();

  const handleReset = () => {
    resetSettings();
    toast.success('Configurações restauradas!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Parâmetros do Sistema</h1>
          <p className="text-muted-foreground">Configure as preferências do sistema</p>
        </div>
        <Button variant="outline" onClick={handleReset}>Restaurar Padrões</Button>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="gap-2"><SettingsIcon className="w-4 h-4" />Geral</TabsTrigger>
          <TabsTrigger value="production" className="gap-2"><Factory className="w-4 h-4" />Produção</TabsTrigger>
          <TabsTrigger value="commercial" className="gap-2"><ShoppingCart className="w-4 h-4" />Comercial</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell className="w-4 h-4" />Notificações</TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2"><Plug className="w-4 h-4" />Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>Configurações básicas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Empresa</Label>
                  <Input value={settings.general.companyName} onChange={(e) => updateSettings('general', { companyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Fuso Horário</Label>
                  <Select value={settings.general.timezone} onValueChange={(v) => updateSettings('general', { timezone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Formato de Data</Label>
                  <Select value={settings.general.dateFormat} onValueChange={(v) => updateSettings('general', { dateFormat: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Moeda</Label>
                  <Select value={settings.general.currency} onValueChange={(v) => updateSettings('general', { currency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Idioma</Label>
                  <Select value={settings.general.language} onValueChange={(v) => updateSettings('general', { language: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (BR)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="production">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Produção</CardTitle>
              <CardDescription>Parâmetros do módulo de produção</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Turno Padrão</Label>
                  <Select value={settings.production.defaultShift} onValueChange={(v) => updateSettings('production', { defaultShift: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1º Turno</SelectItem>
                      <SelectItem value="2">2º Turno</SelectItem>
                      <SelectItem value="3">3º Turno</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Duração do Turno (horas)</Label>
                  <Input type="number" value={settings.production.shiftDuration} onChange={(e) => updateSettings('production', { shiftDuration: Number(e.target.value) })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Alerta de Estoque Mínimo</Label>
                <Input type="number" value={settings.production.minStockAlert} onChange={(e) => updateSettings('production', { minStockAlert: Number(e.target.value) })} className="max-w-xs" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Gerar OP Automaticamente</p><p className="text-sm text-muted-foreground">Criar ordens de produção ao receber pedidos</p></div>
                <Switch checked={settings.production.autoGenerateOP} onCheckedChange={(v) => updateSettings('production', { autoGenerateOP: v })} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Verificação de Qualidade Obrigatória</p><p className="text-sm text-muted-foreground">Exigir inspeção de qualidade antes de finalizar</p></div>
                <Switch checked={settings.production.qualityCheckRequired} onCheckedChange={(v) => updateSettings('production', { qualityCheckRequired: v })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commercial">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Comerciais</CardTitle>
              <CardDescription>Parâmetros do módulo comercial</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prazo de Pagamento Padrão (dias)</Label>
                  <Input type="number" value={settings.commercial.defaultPaymentTerms} onChange={(e) => updateSettings('commercial', { defaultPaymentTerms: Number(e.target.value) })} />
                </div>
                <div className="space-y-2">
                  <Label>Desconto Máximo (%)</Label>
                  <Input type="number" value={settings.commercial.maxDiscount} onChange={(e) => updateSettings('commercial', { maxDiscount: Number(e.target.value) })} />
                </div>
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Aprovação de Pedidos</p><p className="text-sm text-muted-foreground">Exigir aprovação para pedidos acima do limite</p></div>
                <Switch checked={settings.commercial.requireApproval} onCheckedChange={(v) => updateSettings('commercial', { requireApproval: v })} />
              </div>
              {settings.commercial.requireApproval && (
                <div className="space-y-2">
                  <Label>Limite para Aprovação (R$)</Label>
                  <Input type="number" value={settings.commercial.approvalThreshold} onChange={(e) => updateSettings('commercial', { approvalThreshold: Number(e.target.value) })} className="max-w-xs" />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notificações</CardTitle>
              <CardDescription>Configure alertas e notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Notificações por Email</p><p className="text-sm text-muted-foreground">Receber alertas por email</p></div>
                <Switch checked={settings.notifications.emailEnabled} onCheckedChange={(v) => updateSettings('notifications', { emailEnabled: v })} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Alerta de Estoque Baixo</p><p className="text-sm text-muted-foreground">Notificar quando estoque atingir mínimo</p></div>
                <Switch checked={settings.notifications.lowStockAlert} onCheckedChange={(v) => updateSettings('notifications', { lowStockAlert: v })} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Mudança de Status de Pedido</p><p className="text-sm text-muted-foreground">Notificar alterações em pedidos</p></div>
                <Switch checked={settings.notifications.orderStatusChange} onCheckedChange={(v) => updateSettings('notifications', { orderStatusChange: v })} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Atraso na Produção</p><p className="text-sm text-muted-foreground">Alertar sobre ordens atrasadas</p></div>
                <Switch checked={settings.notifications.productionDelay} onCheckedChange={(v) => updateSettings('notifications', { productionDelay: v })} />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Problemas de Qualidade</p><p className="text-sm text-muted-foreground">Alertar sobre não conformidades</p></div>
                <Switch checked={settings.notifications.qualityIssue} onCheckedChange={(v) => updateSettings('notifications', { qualityIssue: v })} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>Configure integrações com sistemas externos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div><p className="font-medium">Integração ERP</p><p className="text-sm text-muted-foreground">Conectar com sistema ERP externo</p></div>
                <Switch checked={settings.integrations.erpEnabled} onCheckedChange={(v) => updateSettings('integrations', { erpEnabled: v })} />
              </div>
              {settings.integrations.erpEnabled && (
                <div className="space-y-4 p-4 rounded-lg border bg-muted/50">
                  <div className="space-y-2">
                    <Label>Endpoint da API</Label>
                    <Input value={settings.integrations.erpEndpoint} onChange={(e) => updateSettings('integrations', { erpEndpoint: e.target.value })} placeholder="https://api.erp.com/v1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chave da API</Label>
                    <Input type="password" value={settings.integrations.apiKey} onChange={(e) => updateSettings('integrations', { apiKey: e.target.value })} placeholder="••••••••" />
                  </div>
                  <Button variant="outline" onClick={() => toast.info('Teste de conexão em desenvolvimento')}>Testar Conexão</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
