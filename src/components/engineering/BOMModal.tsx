import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BOM } from '@/types/bom';
import { Package, Wrench, Clock, DollarSign, AlertCircle } from 'lucide-react';

interface BOMModalProps {
  bom: BOM | null;
  open: boolean;
  onClose: () => void;
}

export const BOMModal = ({ bom, open, onClose }: BOMModalProps) => {
  if (!bom) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Estrutura de Produto - {bom.productName}</span>
            <Badge variant={bom.status === 'ativo' ? 'default' : 'secondary'}>
              {bom.status === 'ativo' ? 'Ativo' : bom.status === 'inativo' ? 'Inativo' : 'Em Revisão'}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações Gerais */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Versão</p>
              <p className="font-medium">{bom.version}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criado por</p>
              <p className="font-medium">{bom.createdBy}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Custo Total</p>
              <p className="font-medium text-lg">R$ {bom.totalCost.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tempo Total</p>
              <p className="font-medium text-lg">{bom.totalTime} minutos</p>
            </div>
          </div>

          {bom.notes && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Observações</p>
                  <p className="text-sm text-muted-foreground">{bom.notes}</p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Componentes */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Componentes ({bom.components.length})</h3>
            </div>
            <div className="space-y-3">
              {bom.components.map((component) => (
                <div key={component.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium">{component.productName}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>Qtd: {component.quantity} {component.unit}</span>
                        <span>Perda: {component.waste}%</span>
                        <span className="font-medium text-foreground">R$ {component.cost.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Processos */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Processos de Produção ({bom.processes.length})</h3>
            </div>
            <div className="space-y-3">
              {bom.processes.map((process) => (
                <div key={process.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{process.sequence}</Badge>
                      <p className="font-medium">{process.name}</p>
                    </div>
                  </div>
                  {process.description && (
                    <p className="text-sm text-muted-foreground mb-3">{process.description}</p>
                  )}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>Tempo: {process.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>Setup: {process.setupTime} min</span>
                    </div>
                    {process.resourceName && (
                      <div className="text-muted-foreground">
                        Recurso: {process.resourceName}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
