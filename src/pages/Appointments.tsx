import { Layout } from '@/components/Layout';
import { AppointmentForm } from '@/components/production/AppointmentForm';
import { AppointmentHistory } from '@/components/production/AppointmentHistory';
import { EfficiencyChart } from '@/components/production/EfficiencyChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, BarChart3, History } from 'lucide-react';

export default function Appointments() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Apontamentos de Produção</h1>
          <p className="text-muted-foreground">
            Registre a produção em tempo real e acompanhe a eficiência
          </p>
        </div>

        <Tabs defaultValue="appointment" className="space-y-4">
          <TabsList>
            <TabsTrigger value="appointment" className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Apontar
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Eficiência
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointment" className="space-y-4">
            <AppointmentForm />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <AppointmentHistory />
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <EfficiencyChart />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
