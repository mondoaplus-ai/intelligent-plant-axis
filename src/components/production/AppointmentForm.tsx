import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppointmentStore } from '@/lib/appointmentStore';
import { useProductionOrderStore } from '@/lib/productionOrderStore';
import { toast } from '@/hooks/use-toast';
import { Clock, PlayCircle, StopCircle, Package, AlertTriangle } from 'lucide-react';

export function AppointmentForm() {
  const { orders } = useProductionOrderStore();
  const { addAppointment, updateAppointment, appointments } = useAppointmentStore();
  
  const [selectedOrder, setSelectedOrder] = useState('');
  const [quantityProduced, setQuantityProduced] = useState('');
  const [quantityRejected, setQuantityRejected] = useState('');
  const [stopTime, setStopTime] = useState('');
  const [stopReason, setStopReason] = useState('');
  const [notes, setNotes] = useState('');
  
  const activeOrders = orders.filter(o => 
    o.status === 'Produzindo' || o.status === 'Em Setup' || o.status === 'Pausada'
  );
  
  const currentAppointment = appointments.find(a => 
    a.productionOrderId === selectedOrder && a.status === 'Em Andamento'
  );

  const handleStartAppointment = () => {
    if (!selectedOrder) {
      toast({
        title: "Erro",
        description: "Selecione uma ordem de produção",
        variant: "destructive"
      });
      return;
    }

    const order = orders.find(o => o.id === selectedOrder);
    if (!order) return;

    const now = new Date();
    const time = now.toTimeString().slice(0, 5);
    const hour = now.getHours();
    const shift = hour < 12 ? 'Manhã' : hour < 18 ? 'Tarde' : 'Noite';

    addAppointment({
      orderNumber: order.orderNumber,
      productionOrderId: order.id,
      productName: order.productName,
      productCode: order.productCode,
      machine: order.machine || 'N/A',
      operator: order.operator || 'N/A',
      shift,
      date: now.toISOString().split('T')[0],
      startTime: time,
      quantityProduced: 0,
      quantityRejected: 0,
      status: 'Em Andamento',
      createdBy: order.operator || 'Sistema'
    });

    toast({
      title: "Apontamento Iniciado",
      description: `OP ${order.orderNumber} em andamento`
    });
  };

  const handleFinishAppointment = () => {
    if (!currentAppointment) return;

    const produced = parseInt(quantityProduced) || 0;
    const rejected = parseInt(quantityRejected) || 0;
    const stop = parseInt(stopTime) || 0;
    
    const now = new Date();
    const endTime = now.toTimeString().slice(0, 5);
    
    const quality = produced > 0 ? ((produced - rejected) / produced) * 100 : 100;
    const efficiency = quality > 0 ? quality - (stop * 0.1) : 0;
    
    updateAppointment(currentAppointment.id, {
      endTime,
      quantityProduced: produced,
      quantityRejected: rejected,
      stopTime: stop,
      stopReason: stopReason || undefined,
      notes: notes || undefined,
      efficiency: Math.max(0, efficiency),
      quality,
      status: 'Concluído'
    });

    setQuantityProduced('');
    setQuantityRejected('');
    setStopTime('');
    setStopReason('');
    setNotes('');

    toast({
      title: "Apontamento Finalizado",
      description: `${produced} peças produzidas`
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Apontar Produção
        </CardTitle>
        <CardDescription>Registre a produção em tempo real</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Ordem de Produção</Label>
          <Select value={selectedOrder} onValueChange={setSelectedOrder}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a OP" />
            </SelectTrigger>
            <SelectContent>
              {activeOrders.map(order => (
                <SelectItem key={order.id} value={order.id}>
                  {order.orderNumber} - {order.productName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!currentAppointment && selectedOrder && (
          <Button onClick={handleStartAppointment} className="w-full">
            <PlayCircle className="mr-2 h-4 w-4" />
            Iniciar Apontamento
          </Button>
        )}

        {currentAppointment && (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="font-medium">Em produção desde {currentAppointment.startTime}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Qtd Produzida</Label>
                <Input
                  type="number"
                  value={quantityProduced}
                  onChange={(e) => setQuantityProduced(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Qtd Rejeitada</Label>
                <Input
                  type="number"
                  value={quantityRejected}
                  onChange={(e) => setQuantityRejected(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tempo Parada (min)</Label>
                <Input
                  type="number"
                  value={stopTime}
                  onChange={(e) => setStopTime(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>Motivo Parada</Label>
                <Select value={stopReason} onValueChange={setStopReason}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Setup">Setup</SelectItem>
                    <SelectItem value="Troca de Ferramenta">Troca de Ferramenta</SelectItem>
                    <SelectItem value="Manutenção">Manutenção</SelectItem>
                    <SelectItem value="Falta de Material">Falta de Material</SelectItem>
                    <SelectItem value="Reabastecimento">Reabastecimento</SelectItem>
                    <SelectItem value="Quebra de Máquina">Quebra de Máquina</SelectItem>
                    <SelectItem value="Ajuste de Qualidade">Ajuste de Qualidade</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre a produção..."
                rows={3}
              />
            </div>

            <Button onClick={handleFinishAppointment} className="w-full" variant="default">
              <StopCircle className="mr-2 h-4 w-4" />
              Finalizar Apontamento
            </Button>
          </>
        )}

        {!selectedOrder && (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Selecione uma ordem de produção para iniciar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
