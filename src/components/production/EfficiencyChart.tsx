import { useMemo } from 'react';
import { useAppointmentStore } from '@/lib/appointmentStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { EfficiencyData } from '@/types/appointment';

export function EfficiencyChart() {
  const { appointments } = useAppointmentStore();

  const efficiencyByMachine = useMemo(() => {
    const machineMap = new Map<string, EfficiencyData>();

    appointments
      .filter(a => a.status === 'Concluído')
      .forEach(appointment => {
        const existing = machineMap.get(appointment.machine);
        
        if (existing) {
          existing.totalProduced += appointment.quantityProduced;
          existing.totalRejected += appointment.quantityRejected;
          existing.efficiency = (existing.efficiency + (appointment.efficiency || 0)) / 2;
          existing.oee = (existing.oee + (appointment.oee || 0)) / 2;
        } else {
          machineMap.set(appointment.machine, {
            machine: appointment.machine,
            efficiency: appointment.efficiency || 0,
            oee: appointment.oee || 0,
            totalProduced: appointment.quantityProduced,
            totalRejected: appointment.quantityRejected
          });
        }
      });

    return Array.from(machineMap.values()).sort((a, b) => b.oee - a.oee);
  }, [appointments]);

  const overallMetrics = useMemo(() => {
    const completed = appointments.filter(a => a.status === 'Concluído');
    const totalProduced = completed.reduce((sum, a) => sum + a.quantityProduced, 0);
    const totalRejected = completed.reduce((sum, a) => sum + a.quantityRejected, 0);
    const avgEfficiency = completed.reduce((sum, a) => sum + (a.efficiency || 0), 0) / (completed.length || 1);
    const avgOEE = completed.reduce((sum, a) => sum + (a.oee || 0), 0) / (completed.length || 1);
    const qualityRate = totalProduced > 0 ? ((totalProduced - totalRejected) / totalProduced) * 100 : 0;

    return {
      totalProduced,
      totalRejected,
      avgEfficiency,
      avgOEE,
      qualityRate
    };
  }, [appointments]);

  const getBarColor = (value: number) => {
    if (value >= 90) return '#10b981';
    if (value >= 75) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" />
              Eficiência Média
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.avgEfficiency.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallMetrics.avgEfficiency >= 90 ? 'Excelente' : 
               overallMetrics.avgEfficiency >= 75 ? 'Bom' : 'Atenção'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              OEE Médio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.avgOEE.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Overall Equipment Effectiveness
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
              Taxa de Qualidade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallMetrics.qualityRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallMetrics.totalRejected} peças rejeitadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Total Produzido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {overallMetrics.totalProduced.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Peças no período
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eficiência por Máquina</CardTitle>
          <CardDescription>
            OEE e Eficiência comparativa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={efficiencyByMachine}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="machine" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="oee" name="OEE (%)" radius={[8, 8, 0, 0]}>
                {efficiencyByMachine.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.oee)} />
                ))}
              </Bar>
              <Bar dataKey="efficiency" name="Eficiência (%)" radius={[8, 8, 0, 0]}>
                {efficiencyByMachine.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBarColor(entry.efficiency)} opacity={0.6} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
