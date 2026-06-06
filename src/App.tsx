import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/hooks/useAuth";
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
import Cash from "./pages/Cash";
import Auth from "./pages/Auth";
import NotFoundPage from "./pages/NotFoundPage";
import { Loader2 } from "lucide-react";

const queryClient = new QueryClient();

const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-poppins font-bold text-foreground">{title}</h2>
      <p className="text-muted-foreground">Esta página está em desenvolvimento</p>
    </div>
  </div>
);

const ProtectedRoutes = () => {
  const { user, isReady } = useAuth();

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/producao/ordens" element={<ProductionOrders />} />
        <Route path="/producao/apontamentos" element={<Appointments />} />
        <Route path="/producao/engenharia" element={<Engineering />} />
        <Route path="/comercial/pedidos" element={<Orders />} />
        <Route path="/comercial/clientes" element={<Customers />} />
        <Route path="/comercial/precos" element={<PriceList />} />
        <Route path="/estoque/movimentacoes" element={<StockMovements />} />
        <Route path="/estoque/inventario" element={<StockInventory />} />
        <Route path="/estoque/produtos" element={<Products />} />
        <Route path="/financeiro/caixa" element={<Cash />} />
        <Route path="/ia/sequenciamento" element={<PlaceholderPage title="Otimização de Sequenciamento" />} />
        <Route path="/ia/qualidade" element={<PlaceholderPage title="Previsão de Qualidade" />} />
        <Route path="/ia/insights" element={<PlaceholderPage title="Insights Automáticos" />} />
        <Route path="/relatorios" element={<Reports />} />
        <Route path="/cadastros/produtos" element={<Products />} />
        <Route path="/cadastros/empresas" element={<Companies />} />
        <Route path="/cadastros/usuarios" element={<Users />} />
        <Route path="/cadastros/parametros" element={<Settings />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
};

const AuthRoute = () => {
  const { user, isReady } = useAuth();
  
  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Auth />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthRoute />} />
            <Route path="/*" element={<ProtectedRoutes />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
