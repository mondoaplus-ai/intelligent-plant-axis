import { NavLink } from 'react-router-dom';
import { useAppStore } from '@/lib/store';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Factory,
  ShoppingCart,
  Package,
  Brain,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  FileText,
  ClipboardCheck,
  Wrench,
  ShoppingBag,
  Users,
  DollarSign,
  Move,
  Archive,
  Box,
  Building2,
  UserCog,
  Sliders,
  BarChart3,
} from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface MenuItem {
  title: string;
  icon: any;
  path: string;
  badge?: string;
  submenu?: { title: string; icon: any; path: string }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    title: 'Produção',
    icon: Factory,
    path: '/producao',
    submenu: [
      { title: 'Ordens de Produção', icon: FileText, path: '/producao/ordens' },
      { title: 'Apontamentos', icon: ClipboardCheck, path: '/producao/apontamentos' },
      { title: 'Engenharia de Produto', icon: Wrench, path: '/producao/engenharia' },
    ],
  },
  {
    title: 'Comercial',
    icon: ShoppingCart,
    path: '/comercial',
    submenu: [
      { title: 'Pedidos', icon: ShoppingBag, path: '/comercial/pedidos' },
      { title: 'Clientes', icon: Users, path: '/comercial/clientes' },
      { title: 'Tabela de Preços', icon: DollarSign, path: '/comercial/precos' },
    ],
  },
  {
    title: 'Estoque',
    icon: Package,
    path: '/estoque',
    submenu: [
      { title: 'Movimentações', icon: Move, path: '/estoque/movimentacoes' },
      { title: 'Inventário', icon: Archive, path: '/estoque/inventario' },
      { title: 'Produtos', icon: Box, path: '/estoque/produtos' },
    ],
  },
  {
    title: 'IA Produtiva',
    icon: Brain,
    path: '/ia',
    badge: 'BETA',
    submenu: [
      { title: 'Otimização de Sequenciamento', icon: Sliders, path: '/ia/sequenciamento' },
      { title: 'Previsão de Qualidade', icon: ClipboardCheck, path: '/ia/qualidade' },
      { title: 'Insights Automáticos', icon: Brain, path: '/ia/insights' },
    ],
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    path: '/relatorios',
  },
  {
    title: 'Cadastros',
    icon: Settings,
    path: '/cadastros',
    submenu: [
      { title: 'Produtos', icon: Package, path: '/cadastros/produtos' },
      { title: 'Empresas', icon: Building2, path: '/cadastros/empresas' },
      { title: 'Usuários', icon: UserCog, path: '/cadastros/usuarios' },
      { title: 'Parâmetros', icon: Sliders, path: '/cadastros/parametros' },
    ],
  },
];

export const Sidebar = () => {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((item) => item !== title) : [...prev, title]
    );
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 64 : 256 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-50 flex flex-col"
    >
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-poppins font-bold text-foreground">SmartERP</h1>
              <p className="text-xs text-accent">AI Powered</p>
            </div>
          </motion.div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-2 space-y-1">
        {menuItems.map((item) => (
          <div key={item.title}>
            {item.submenu ? (
              <>
                <button
                  onClick={() => toggleExpanded(item.title)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth",
                    "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground",
                    item.title === 'IA Produtiva' && "bg-primary/10 border border-primary/20"
                  )}
                >
                  <item.icon className={cn(
                    "w-5 h-5 shrink-0",
                    item.title === 'IA Produtiva' && "text-accent animate-pulse-glow"
                  )} />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs bg-accent text-accent-foreground">
                          {item.badge}
                        </Badge>
                      )}
                      {expandedItems.includes(item.title) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </>
                  )}
                </button>
                {expandedItems.includes(item.title) && !sidebarCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-4 mt-1 space-y-1"
                  >
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-smooth",
                            isActive
                              ? "bg-primary text-primary-foreground font-medium"
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )
                        }
                      >
                        <subItem.icon className="w-4 h-4 shrink-0" />
                        <span>{subItem.title}</span>
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-smooth",
                    isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.title}</span>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>
    </motion.aside>
  );
};
