import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProductStore } from '@/lib/productStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#6b7280'];

export const InventoryReport = () => {
  const products = useProductStore((state) => state.products);

  const activeProducts = products.filter(p => p.status === 'Ativo').length;
  const lowStockProducts = products.filter(p => p.currentStock <= p.minStock && p.status === 'Ativo').length;
  const inactiveProducts = products.filter(p => p.status === 'Inativo').length;
  const totalValue = products.reduce((sum, p) => sum + (p.currentStock * p.avgCost), 0);

  const stats = [
    { title: 'Produtos Ativos', value: activeProducts, icon: Package, color: 'text-success' },
    { title: 'Estoque Baixo', value: lowStockProducts, icon: AlertTriangle, color: 'text-warning' },
    { title: 'Inativos', value: inactiveProducts, icon: XCircle, color: 'text-muted-foreground' },
    { title: 'Valor Total', value: `R$ ${totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, icon: CheckCircle, color: 'text-primary' },
  ];

  const stockLevelData = products.map(p => ({
    name: p.name,
    'Estoque Atual': p.currentStock,
    'Estoque Mínimo': p.minStock,
  }));

  const categoryData = [
    { name: 'Adequado', value: products.filter(p => p.currentStock > p.minStock * 2).length },
    { name: 'Atenção', value: products.filter(p => p.currentStock > p.minStock && p.currentStock <= p.minStock * 2).length },
    { name: 'Crítico', value: products.filter(p => p.currentStock <= p.minStock).length },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Níveis de Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stockLevelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="Estoque Atual" fill="hsl(var(--primary))" />
                <Bar dataKey="Estoque Mínimo" fill="hsl(var(--warning))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status do Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produtos com Estoque Crítico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {products
              .filter(p => p.currentStock <= p.minStock && p.status === 'Ativo')
              .map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning" />
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.code}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Estoque: {product.currentStock} {product.unit}
                    </p>
                    <Badge variant="secondary" className="bg-warning/10 text-warning">
                      Mín: {product.minStock}
                    </Badge>
                  </div>
                </div>
              ))}
            {products.filter(p => p.currentStock <= p.minStock && p.status === 'Ativo').length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-2 text-success" />
                <p>Todos os produtos estão com estoque adequado!</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
