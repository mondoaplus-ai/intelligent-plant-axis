import { useState } from 'react';
import { useAppointmentStore } from '@/lib/appointmentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { History, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function AppointmentHistory() {
  const { appointments } = useAppointmentStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');

  const filteredAppointments = appointments
    .filter(a => {
      const matchesSearch = 
        a.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.operator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.machine.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
      const matchesShift = shiftFilter === 'all' || a.shift === shiftFilter;
      
      return matchesSearch && matchesStatus && matchesShift;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      'Concluído': 'default',
      'Em Andamento': 'secondary',
      'Pausado': 'destructive'
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getEfficiencyIcon = (efficiency?: number) => {
    if (!efficiency) return <Minus className="h-4 w-4 text-muted-foreground" />;
    if (efficiency >= 90) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (efficiency >= 75) return <Minus className="h-4 w-4 text-yellow-500" />;
    return <TrendingDown className="h-4 w-4 text-red-500" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Histórico de Apontamentos
        </CardTitle>
        <CardDescription>Visualize todos os apontamentos realizados</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Buscar por OP, produto, operador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
              <SelectItem value="Em Andamento">Em Andamento</SelectItem>
              <SelectItem value="Pausado">Pausado</SelectItem>
            </SelectContent>
          </Select>
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por turno" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Turnos</SelectItem>
              <SelectItem value="Manhã">Manhã</SelectItem>
              <SelectItem value="Tarde">Tarde</SelectItem>
              <SelectItem value="Noite">Noite</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>OP</TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Máquina</TableHead>
                <TableHead>Operador</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead className="text-right">Produzido</TableHead>
                <TableHead className="text-right">Rejeitado</TableHead>
                <TableHead className="text-right">Eficiência</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhum apontamento encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell className="font-medium">
                      {new Date(appointment.date).toLocaleDateString('pt-BR')}
                      <br />
                      <span className="text-xs text-muted-foreground">
                        {appointment.startTime} - {appointment.endTime || '...'}
                      </span>
                    </TableCell>
                    <TableCell>{appointment.orderNumber}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.productName}</div>
                        <div className="text-xs text-muted-foreground">{appointment.productCode}</div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.machine}</TableCell>
                    <TableCell>{appointment.operator}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{appointment.shift}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {appointment.quantityProduced.toLocaleString('pt-BR')}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={appointment.quantityRejected > 0 ? 'text-red-500' : ''}>
                        {appointment.quantityRejected.toLocaleString('pt-BR')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {getEfficiencyIcon(appointment.efficiency)}
                        <span className="font-medium">
                          {appointment.efficiency ? `${appointment.efficiency.toFixed(1)}%` : '-'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {filteredAppointments.length} de {appointments.length} apontamentos
        </div>
      </CardContent>
    </Card>
  );
}
