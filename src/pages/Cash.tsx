import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, TrendingDown, Wallet, Clock, Loader2, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  useCashAccounts,
  useCashCategories,
  useCashEntries,
  useCashSummary,
  useCreateCashEntry,
  useDeleteCashEntry,
  CashEntryFilters,
  CreateCashEntry,
} from '@/hooks/useCash';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Order } from '@/types/order';

const fmtBRL = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Cash() {
  const [filters, setFilters] = useState<CashEntryFilters>({ type: 'all', status: 'all' });
  const [modalOpen, setModalOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const { canEdit, canDelete } = useUserRole();

  const { data: accounts = [] } = useCashAccounts();
  const { data: categories = [] } = useCashCategories();
  const { data: entries = [], isLoading } = useCashEntries(filters);
  const { data: allEntries = [] } = useCashEntries();
  const { data: orders = [] } = useOrders();
  const summary = useCashSummary();
  const createEntry = useCreateCashEntry();
  const deleteEntry = useDeleteCashEntry();
  const updateOrderStatus = useUpdateOrderStatus();

  const paidOrderIds = useMemo(
    () => new Set(allEntries.filter((e) => e.order_id && e.status !== 'cancelado').map((e) => e.order_id!)),
    [allEntries]
  );

  const handleDelete = (id: string) => {
    if (!canDelete) return toast.error('Sem permissão para excluir');
    if (!confirm('Excluir este lançamento?')) return;
    deleteEntry.mutate(id, {
      onSuccess: () => toast.success('Lançamento excluído'),
      onError: (e: any) => toast.error(e?.message ?? 'Erro ao excluir'),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Caixa & Financeiro</h1>
          <p className="text-muted-foreground mt-1">
            Controle de receitas, despesas e saldos das contas
          </p>
        </div>
        {canEdit && (
          <Button onClick={() => setModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Novo Lançamento
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard title="Saldo Total" value={summary.totalBalance} icon={Wallet} color="text-primary" />
        <SummaryCard title="Receitas (mês)" value={summary.revenue} icon={TrendingUp} color="text-green-500" />
        <SummaryCard title="Despesas (mês)" value={summary.expense} icon={TrendingDown} color="text-red-500" />
        <SummaryCard title="Pendentes" value={summary.pending} icon={Clock} color="text-yellow-500" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Select value={filters.type} onValueChange={(v: any) => setFilters({ ...filters, type: v })}>
              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filters.status} onValueChange={(v: any) => setFilters({ ...filters, status: v })}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
                <SelectItem value="cancelado">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.accountId ?? 'all'}
              onValueChange={(v) => setFilters({ ...filters, accountId: v === 'all' ? undefined : v })}
            >
              <SelectTrigger><SelectValue placeholder="Conta" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as contas</SelectItem>
                {accounts.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="date"
              value={filters.from ?? ''}
              onChange={(e) => setFilters({ ...filters, from: e.target.value || undefined })}
              placeholder="A partir de"
            />
          </div>
        </CardContent>
      </Card>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Valor</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8"><Loader2 className="w-5 h-5 animate-spin mx-auto" /></TableCell></TableRow>
            ) : entries.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum lançamento</TableCell></TableRow>
            ) : (
              entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell>{format(new Date(e.date), 'dd/MM/yyyy')}</TableCell>
                  <TableCell className="font-medium">{e.description}</TableCell>
                  <TableCell>
                    <Badge variant={e.type === 'receita' ? 'default' : 'secondary'}>
                      {e.type === 'receita' ? 'Receita' : 'Despesa'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={e.status === 'confirmado' ? 'default' : e.status === 'pendente' ? 'outline' : 'destructive'}>
                      {e.status}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-medium ${e.type === 'receita' ? 'text-green-500' : 'text-red-500'}`}>
                    {e.type === 'receita' ? '+' : '-'} {fmtBRL(e.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {canDelete && (
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(e.id)}>
                        Excluir
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CashEntryModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        accounts={accounts}
        categories={categories}
        onSave={(data) =>
          createEntry.mutate(data, {
            onSuccess: () => {
              toast.success('Lançamento criado');
              setModalOpen(false);
            },
            onError: (e: any) => toast.error(e?.message ?? 'Erro ao salvar'),
          })
        }
        saving={createEntry.isPending}
      />
    </motion.div>
  );
}

const SummaryCard = ({ title, value, icon: Icon, color }: any) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className={`w-4 h-4 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className={`text-2xl font-bold ${color}`}>{fmtBRL(value)}</div>
    </CardContent>
  </Card>
);

interface ModalProps {
  open: boolean;
  onClose: () => void;
  accounts: any[];
  categories: any[];
  onSave: (data: CreateCashEntry) => void;
  saving?: boolean;
}

const CashEntryModal = ({ open, onClose, accounts, categories, onSave, saving }: ModalProps) => {
  const [form, setForm] = useState<CreateCashEntry>({
    cash_account_id: '',
    category_id: null,
    type: 'receita',
    status: 'confirmado',
    description: '',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    due_date: null,
    payment_date: null,
    payment_method: null,
    document_number: null,
    notes: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.cash_account_id) return toast.error('Selecione uma conta');
    if (!form.description) return toast.error('Informe a descrição');
    if (form.amount <= 0) return toast.error('Valor deve ser positivo');
    onSave(form);
  };

  const filteredCats = categories.filter((c) => c.type === form.type);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Novo Lançamento</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={form.type} onValueChange={(v: any) => setForm({ ...form, type: v, category_id: null })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v: any) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Conta</Label>
              <Select value={form.cash_account_id} onValueChange={(v) => setForm({ ...form, cash_account_id: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select
                value={form.category_id ?? ''}
                onValueChange={(v) => setForm({ ...form, category_id: v || null })}
              >
                <SelectTrigger><SelectValue placeholder="Opcional" /></SelectTrigger>
                <SelectContent>
                  {filteredCats.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Valor (R$)</Label>
              <Input
                type="number" step="0.01" min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Data</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Vencimento</Label>
              <Input type="date" value={form.due_date ?? ''} onChange={(e) => setForm({ ...form, due_date: e.target.value || null })} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observações</Label>
            <Textarea rows={2} value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value || null })} />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
