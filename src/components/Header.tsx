import { Bell, ChevronRight, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useAppStore } from '@/lib/store';
import { useLocation } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

const breadcrumbMap: Record<string, string[]> = {
  '/': ['Dashboard'],
  '/producao/ordens': ['Produção', 'Ordens de Produção'],
  '/producao/apontamentos': ['Produção', 'Apontamentos'],
  '/producao/engenharia': ['Produção', 'Engenharia de Produto'],
  '/comercial/pedidos': ['Comercial', 'Pedidos'],
  '/comercial/clientes': ['Comercial', 'Clientes'],
  '/comercial/precos': ['Comercial', 'Tabela de Preços'],
  '/estoque/movimentacoes': ['Estoque', 'Movimentações'],
  '/estoque/inventario': ['Estoque', 'Inventário'],
  '/estoque/produtos': ['Estoque', 'Produtos'],
  '/ia/sequenciamento': ['IA Produtiva', 'Otimização de Sequenciamento'],
  '/ia/qualidade': ['IA Produtiva', 'Previsão de Qualidade'],
  '/ia/insights': ['IA Produtiva', 'Insights Automáticos'],
  '/cadastros/empresas': ['Cadastros', 'Empresas'],
  '/cadastros/usuarios': ['Cadastros', 'Usuários'],
  '/cadastros/parametros': ['Cadastros', 'Parâmetros'],
};

export const Header = () => {
  const { user, notifications } = useAppStore();
  const location = useLocation();
  const breadcrumbs = breadcrumbMap[location.pathname] || ['Dashboard'];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card shadow-sm">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
              <span
                className={
                  index === breadcrumbs.length - 1
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground'
                }
              >
                {crumb}
              </span>
            </div>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            {notifications > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {notifications}
              </Badge>
            )}
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 pl-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left hidden md:block">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.role}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notificações
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-danger">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
