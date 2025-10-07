import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Customer } from "@/types/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TrendingUp, ShoppingCart, CreditCard, Calendar } from "lucide-react";

interface CustomerHistoryProps {
  open: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerHistory = ({ open, onClose, customer }: CustomerHistoryProps) => {
  if (!customer) return null;

  const getStatusColor = (status: string) => {
    const colors = {
      'Orçamento': 'bg-gray-500',
      'Aprovado': 'bg-blue-500',
      'Em Produção': 'bg-amber-500',
      'Faturado': 'bg-purple-500',
      'Entregue': 'bg-green-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const creditPercentage = customer.creditLimit > 0 
    ? Math.round((customer.creditUsed / customer.creditLimit) * 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Histórico do Cliente</DialogTitle>
          <div className="text-sm text-muted-foreground">
            {customer.name} ({customer.code})
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Resumo Comercial */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Total de Compras
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {customer.totalPurchases.toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Ticket Médio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {customer.averageTicket.toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Crédito Disponível
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  R$ {(customer.creditLimit - customer.creditUsed).toLocaleString('pt-BR')}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${creditPercentage > 80 ? 'bg-red-500' : creditPercentage > 60 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(creditPercentage, 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{creditPercentage}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Última Compra
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">
                  {customer.lastPurchase 
                    ? format(new Date(customer.lastPurchase), "dd/MM/yyyy", { locale: ptBR })
                    : 'Nunca'
                  }
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Histórico de Pedidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Histórico de Pedidos</h3>
            {customer.purchases.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum pedido registrado
              </div>
            ) : (
              <div className="space-y-3">
                {customer.purchases.map((purchase) => (
                  <Card key={purchase.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <div className="font-semibold">{purchase.orderId}</div>
                            <div className="text-sm text-muted-foreground">
                              {format(new Date(purchase.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-lg font-bold">
                              R$ {purchase.total.toLocaleString('pt-BR')}
                            </div>
                          </div>

                          <Badge className={`${getStatusColor(purchase.status)} text-white`}>
                            {purchase.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Informações de Contato */}
          {customer.contacts.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Contatos</h3>
              <div className="space-y-2">
                {customer.contacts.map((contact) => (
                  <Card key={contact.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-sm text-muted-foreground">{contact.role}</div>
                        </div>
                        <div className="text-sm text-right">
                          <div>{contact.email}</div>
                          <div className="text-muted-foreground">{contact.phone}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
