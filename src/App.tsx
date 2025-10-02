import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Index from "./pages/Index";
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
        <Routes>
          {/* Dashboard */}
          <Route path="/" element={<Layout><Index /></Layout>} />
          
          {/* Produção */}
          <Route path="/producao/ordens" element={<Layout><PlaceholderPage title="Ordens de Produção" /></Layout>} />
          <Route path="/producao/apontamentos" element={<Layout><PlaceholderPage title="Apontamentos" /></Layout>} />
          <Route path="/producao/engenharia" element={<Layout><PlaceholderPage title="Engenharia de Produto" /></Layout>} />
          
          {/* Comercial */}
          <Route path="/comercial/pedidos" element={<Layout><PlaceholderPage title="Pedidos" /></Layout>} />
          <Route path="/comercial/clientes" element={<Layout><PlaceholderPage title="Clientes" /></Layout>} />
          <Route path="/comercial/precos" element={<Layout><PlaceholderPage title="Tabela de Preços" /></Layout>} />
          
          {/* Estoque */}
          <Route path="/estoque/movimentacoes" element={<Layout><PlaceholderPage title="Movimentações" /></Layout>} />
          <Route path="/estoque/inventario" element={<Layout><PlaceholderPage title="Inventário" /></Layout>} />
          <Route path="/estoque/produtos" element={<Layout><PlaceholderPage title="Produtos" /></Layout>} />
          
          {/* IA Produtiva */}
          <Route path="/ia/sequenciamento" element={<Layout><PlaceholderPage title="Otimização de Sequenciamento" /></Layout>} />
          <Route path="/ia/qualidade" element={<Layout><PlaceholderPage title="Previsão de Qualidade" /></Layout>} />
          <Route path="/ia/insights" element={<Layout><PlaceholderPage title="Insights Automáticos" /></Layout>} />
          
          {/* Cadastros */}
          <Route path="/cadastros/empresas" element={<Layout><PlaceholderPage title="Empresas" /></Layout>} />
          <Route path="/cadastros/usuarios" element={<Layout><PlaceholderPage title="Usuários" /></Layout>} />
          <Route path="/cadastros/parametros" element={<Layout><PlaceholderPage title="Parâmetros" /></Layout>} />
          
          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
