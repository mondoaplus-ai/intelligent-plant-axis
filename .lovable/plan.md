# Plano de Migração SmartERP — Zustand → Supabase + React Query

## Objetivo
Substituir os stores Zustand (dados em memória/localStorage) por hooks React Query que leem e escrevem diretamente nas tabelas do Lovable Cloud, persistindo tudo no banco com RLS.

## Status atual (já feito)
- ✅ Tabelas no banco: `boms`, `bom_components`, `bom_processes`, `products`, `orders`, `order_items`, `cash_accounts`, `cash_entries`, `cash_categories`, etc.
- ✅ Triggers de recálculo de BOM (`recalculate_bom_totals`, `update_cash_balance`)
- ✅ Auth + roles (`user_roles`, `has_role`)
- ✅ `useBOMs.ts`, `useUserRole.ts`, `useProductsList.ts` (módulo BOM já migrado)
- ✅ `QueryClientProvider` configurado em `App.tsx`

## Escopo desta migração

### 1. Ficha Técnica (BOM) — refinamento
- Renomear/alinhar tipos do BOM ao schema do banco (snake_case): `product_name`, `total_cost`, `total_time`, `created_by`, `created_at`, `updated_at`, `component_name`, `waste_pct`.
- Atualizar `BOMTable.tsx` e `BOMModal.tsx` para os novos campos.
- Criar `BOMFormModalV2.tsx` (substitui `BOMFormModal.tsx`) usando o schema real do banco.
- Atualizar `Engineering.tsx` para usar o novo modal.

### 2. Produtos
- Criar `src/hooks/useProducts.ts` com:
  - `useProducts(filters)` — listagem com filtros (busca, categoria, status, tipo).
  - `useCreateProduct()`, `useUpdateProduct()`, `useDeleteProduct()` (mutations).
- Atualizar `src/pages/Products.tsx`:
  - Trocar `useProductStore` por hooks.
  - Adaptar filtros locais para query params.
  - Tratar `isLoading` e erros (toasts).
- Atualizar `ProductModal.tsx` e `ProductImportModal.tsx` para chamar mutations.

### 3. Pedidos
- Criar `src/hooks/useOrders.ts` com:
  - `useOrders()`, `useCreateOrder()`, `useUpdateOrder()`, `useDeleteOrder()`, `useUpdateOrderStatus()`.
  - Lógica de mapear `order_items` (delete-then-insert no update, como no BOM).
- Atualizar `src/pages/Orders.tsx` e `OrderModal.tsx`.

### 4. Caixa (módulo novo)
- Criar `src/hooks/useCash.ts`:
  - `useCashAccounts()`, `useCashEntries(filters)`, `useCashSummary()`, `useCashCategories()`.
  - `useCreateCashEntry()`, `useUpdateCashEntry()`, `useDeleteCashEntry()`.
- Criar `src/pages/Cash.tsx` com:
  - Cards de resumo (saldo total, receitas, despesas do mês).
  - Tabela de lançamentos com filtros (período, conta, tipo, status).
  - Modal de novo lançamento (receita/despesa, conta, categoria, valor, vencimento).
- Adicionar rota `/financeiro/caixa` em `App.tsx`.
- Adicionar item de menu "Financeiro → Caixa" no `Sidebar.tsx`.

### 5. Limpeza
- Manter stores Zustand antigos em paralelo durante a transição.
- Após validar cada módulo no preview, remover o arquivo `src/lib/{módulo}Store.ts` correspondente.

## Fora de escopo (próxima rodada)
- Estoque (`stockMovementStore`, `inventoryStore`)
- Clientes (`customerStore`)
- Ordens de Produção (`productionOrderStore`)
- Apontamentos, Preços, Empresas, Usuários

## Permissões (RBAC já existente)
Todas as ações de criar/editar/excluir respeitam `useUserRole`:
- `admin`/`manager`: tudo
- `operator`: criar e editar
- `viewer`: somente leitura

## Detalhes técnicos

**Padrão dos hooks (igual ao `useBOMs.ts`):**
```ts
const { data, isLoading } = useQuery({ queryKey, queryFn })
const mutation = useMutation({
  mutationFn: async (payload) => { /* supabase call */ },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey });
    toast.success('...');
  },
  onError: (e) => toast.error(e.message),
});
```

**Mapeamento de tipos:** os tipos em `src/types/*.ts` (camelCase) permanecem para a UI; os hooks fazem a conversão de/para snake_case do banco na entrada e saída — assim os componentes existentes precisam de poucas mudanças.

## Entregáveis ao final
Resumo listando para cada módulo: arquivos criados, arquivos editados, arquivos removidos, e como testar (passo a passo no preview).
