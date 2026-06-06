import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem, OrderStatus } from '@/types/order';
import { useAuth } from './useAuth';

const KEY = ['orders'];

const mapItem = (r: any): OrderItem => ({
  id: r.id,
  productId: r.product_id ?? '',
  productCode: r.product_code ?? '',
  productName: r.product_name,
  quantity: Number(r.quantity),
  unit: r.unit,
  unitPrice: Number(r.unit_price),
  discount: Number(r.discount ?? 0),
  total: Number(r.total),
  deliveryDate: r.delivery_date ?? undefined,
  notes: r.notes ?? undefined,
});

const mapOrder = (r: any): Order => ({
  id: r.id,
  orderNumber: r.order_number,
  customerId: r.customer_id ?? '',
  customerName: r.customer_name,
  customerDocument: r.customer_document ?? '',
  status: r.status,
  priority: r.priority,
  orderDate: r.order_date,
  expectedDelivery: r.expected_delivery,
  deliveredDate: r.delivered_date ?? undefined,
  items: (r.order_items ?? []).map(mapItem),
  subtotal: Number(r.subtotal ?? 0),
  discount: Number(r.discount ?? 0),
  shipping: Number(r.shipping ?? 0),
  tax: Number(r.tax ?? 0),
  total: Number(r.total ?? 0),
  paymentMethod: r.payment_method ?? undefined,
  paymentTerm: r.payment_term ?? undefined,
  shippingAddress: r.shipping_street
    ? {
        street: r.shipping_street ?? '',
        number: r.shipping_number ?? '',
        complement: r.shipping_complement ?? '',
        neighborhood: r.shipping_neighborhood ?? '',
        city: r.shipping_city ?? '',
        state: r.shipping_state ?? '',
        zipCode: r.shipping_zip_code ?? '',
      }
    : undefined,
  notes: r.notes ?? undefined,
  internalNotes: r.internal_notes ?? undefined,
  seller: r.seller ?? undefined,
  approvedBy: r.approved_by ?? undefined,
  approvedAt: r.approved_at ?? undefined,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const orderToDb = (o: Partial<Order>) => ({
  order_number: o.orderNumber,
  customer_id: o.customerId || null,
  customer_name: o.customerName,
  customer_document: o.customerDocument ?? null,
  status: o.status,
  priority: o.priority,
  order_date: o.orderDate,
  expected_delivery: o.expectedDelivery,
  delivered_date: o.deliveredDate ?? null,
  subtotal: o.subtotal ?? 0,
  discount: o.discount ?? 0,
  shipping: o.shipping ?? 0,
  tax: o.tax ?? 0,
  total: o.total ?? 0,
  payment_method: o.paymentMethod ?? null,
  payment_term: o.paymentTerm ?? null,
  seller: o.seller ?? null,
  approved_by: o.approvedBy ?? null,
  approved_at: o.approvedAt ?? null,
  shipping_street: o.shippingAddress?.street ?? null,
  shipping_number: o.shippingAddress?.number ?? null,
  shipping_complement: o.shippingAddress?.complement ?? null,
  shipping_neighborhood: o.shippingAddress?.neighborhood ?? null,
  shipping_city: o.shippingAddress?.city ?? null,
  shipping_state: o.shippingAddress?.state ?? null,
  shipping_zip_code: o.shippingAddress?.zipCode ?? null,
  notes: o.notes ?? null,
  internal_notes: o.internalNotes ?? null,
});

const insertItems = async (orderId: string, items: OrderItem[]) => {
  if (!items.length) return;
  const rows = items.map((i) => ({
    order_id: orderId,
    product_id: i.productId && i.productId.length === 36 ? i.productId : null,
    product_code: i.productCode,
    product_name: i.productName,
    quantity: i.quantity,
    unit: i.unit,
    unit_price: i.unitPrice,
    discount: i.discount,
    total: i.total,
    delivery_date: i.deliveryDate ?? null,
    notes: i.notes ?? null,
  }));
  const { error } = await supabase.from('order_items').insert(rows);
  if (error) throw error;
};

export const useOrders = () =>
  useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []).map(mapOrder);
    },
  });

export const useCreateOrder = () => {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (o: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('orders')
        .insert({ ...orderToDb(o), created_by: user?.id ?? null })
        .select('id')
        .single();
      if (error) throw error;
      await insertItems(data.id, o.items);
      return data.id;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useUpdateOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data: o }: { id: string; data: Partial<Order> }) => {
      const { error } = await supabase.from('orders').update(orderToDb(o)).eq('id', id);
      if (error) throw error;
      if (o.items) {
        await supabase.from('order_items').delete().eq('order_id', id);
        await insertItems(id, o.items);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useDeleteOrder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: OrderStatus }) => {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};
