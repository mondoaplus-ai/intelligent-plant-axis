import { KPICards } from '@/components/dashboard/KPICards';
import { ProductionChart } from '@/components/dashboard/ProductionChart';
import { ActiveOrdersTable } from '@/components/dashboard/ActiveOrdersTable';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { useProductionOrderStore } from '@/lib/productionOrderStore';
import { useCustomerStore } from '@/lib/customerStore';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';

const Index = () => {
  const productionOrders = useProductionOrderStore((state) => state.orders);
  const customers = useCustomerStore((state) => state.customers);
  const { data: salesOrders = [] } = useOrders();
  const { data: products = [] } = useProducts();

  return (
    <div className="space-y-6">
      <KPICards
        productionOrders={productionOrders}
        salesOrders={salesOrders}
        customers={customers}
        products={products}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductionChart productionOrders={productionOrders} />
        </div>
        <div className="lg:col-span-1">
          <ActiveOrdersTable productionOrders={productionOrders} />
        </div>
      </div>

      <AIInsights
        productionOrders={productionOrders}
        salesOrders={salesOrders}
      />
    </div>
  );
};

export default Index;
