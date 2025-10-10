import { KPICards } from '@/components/dashboard/KPICards';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { ActiveOrdersTable } from '@/components/dashboard/ActiveOrdersTable';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { useProductionOrderStore } from '@/lib/productionOrderStore';
import { useOrderStore } from '@/lib/orderStore';
import { useCustomerStore } from '@/lib/customerStore';
import { useProductStore } from '@/lib/productStore';

const Index = () => {
  const productionOrders = useProductionOrderStore((state) => state.orders);
  const salesOrders = useOrderStore((state) => state.orders);
  const customers = useCustomerStore((state) => state.customers);
  const products = useProductStore((state) => state.products);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards 
        productionOrders={productionOrders}
        salesOrders={salesOrders}
        customers={customers}
        products={products}
      />

      {/* Production Chart and Orders Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductionChart productionOrders={productionOrders} />
        </div>
        <div className="lg:col-span-1">
          <ActiveOrdersTable productionOrders={productionOrders} />
        </div>
      </div>

      {/* AI Insights */}
      <AIInsights 
        productionOrders={productionOrders}
        salesOrders={salesOrders}
      />
    </div>
  );
};

export default Index;
