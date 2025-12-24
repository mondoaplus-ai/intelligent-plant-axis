import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductionOrders from "./pages/ProductionOrders";
import Appointments from "./pages/Appointments";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import Reports from "./pages/Reports";
import Engineering from "./pages/Engineering";
import PriceList from "./pages/PriceList";
import StockMovements from "./pages/StockMovements";
import StockInventory from "./pages/StockInventory";
import Companies from "./pages/Companies";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

// Placeholder pages for routes
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-poppins font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground">Esta página está em desenvolvimento</p>
    </div>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            {/* Dashboard */}
            <Route path="/" element={<Index />} />
            
            {/* Produção */}
            <Route path="/producao/ordens" element={<ProductionOrders />} />
            <Route path="/producao/apontamentos" element={<Appointments />} />
            <Route path="/producao/engenharia" element={<Engineering />} />
            
            {/* Comercial */}
            <Route path="/comercial/pedidos" element={<Orders />} />
            <Route path="/comercial/clientes" element={<Customers />} />
            <Route path="/comercial/precos" element={<PriceList />} />
            
            {/* Estoque */}
            <Route path="/estoque/movimentacoes" element={<StockMovements />} />
            <Route path="/estoque/inventario" element={<StockInventory />} />
            <Route path="/estoque/produtos" element={<Products />} />
            
            {/* IA Produtiva */}
            <Route path="/ia/sequenciamento" element={<PlaceholderPage title="Otimização de Sequenciamento" />} />
            <Route path="/ia/qualidade" element={<PlaceholderPage title="Previsão de Qualidade" />} />
            <Route path="/ia/insights" element={<PlaceholderPage title="Insights Automáticos" />} />
            
            {/* Relatórios */}
            <Route path="/relatorios" element={<Reports />} />
            
            {/* Cadastros */}
            <Route path="/cadastros/produtos" element={<Products />} />
            <Route path="/cadastros/empresas" element={<Companies />} />
            <Route path="/cadastros/usuarios" element={<Users />} />
            <Route path="/cadastros/parametros" element={<Settings />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
