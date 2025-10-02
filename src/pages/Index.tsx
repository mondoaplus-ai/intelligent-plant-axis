import { KPICards } from '@/components/dashboard/KPICards';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { ActiveOrdersTable } from '@/components/dashboard/ActiveOrdersTable';
import { AIInsights } from '@/components/dashboard/AIInsights';

const Index = () => {
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards />

      {/* Production Chart and Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductionChart />
        </div>
        <div className="lg:col-span-1">
          <ActiveOrdersTable />
        </div>
      </div>

      {/* AI Insights */}
      <AIInsights />
    </div>
  );
};

export default Index;
