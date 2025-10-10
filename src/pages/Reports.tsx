import { Layout } from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileBarChart, TrendingUp, Package, Zap } from 'lucide-react';
import { ProductionReport } from '@/components/reports/ProductionReport';
import { SalesReport } from '@/components/reports/SalesReport';
import { InventoryReport } from '@/components/reports/InventoryReport';
import { EfficiencyReport } from '@/components/reports/EfficiencyReport';

export default function Reports() {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Relatórios e Analytics</h1>
          <p className="text-muted-foreground">
            Análise completa de produção, vendas, estoque e eficiência
          </p>
        </div>

        <Tabs defaultValue="production" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="production" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Produção
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Vendas
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Estoque
            </TabsTrigger>
            <TabsTrigger value="efficiency" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Eficiência
            </TabsTrigger>
          </TabsList>

          <TabsContent value="production" className="space-y-4">
            <ProductionReport />
          </TabsContent>

          <TabsContent value="sales" className="space-y-4">
            <SalesReport />
          </TabsContent>

          <TabsContent value="inventory" className="space-y-4">
            <InventoryReport />
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-4">
            <EfficiencyReport />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
