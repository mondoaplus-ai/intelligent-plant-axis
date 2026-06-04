export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      accounts_payable: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string
          document_number: string | null
          due_date: string
          id: string
          notes: string | null
          paid_amount: number | null
          payment_date: string | null
          payment_method: string | null
          remaining_amount: number | null
          status: string
          supplier_id: string | null
          supplier_name: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description: string
          document_number?: string | null
          due_date: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          remaining_amount?: number | null
          status?: string
          supplier_id?: string | null
          supplier_name: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string
          document_number?: string | null
          due_date?: string
          id?: string
          notes?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          remaining_amount?: number | null
          status?: string
          supplier_id?: string | null
          supplier_name?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_payable_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      accounts_receivable: {
        Row: {
          created_at: string
          created_by: string | null
          customer_id: string | null
          customer_name: string
          description: string
          due_date: string
          id: string
          notes: string | null
          order_id: string | null
          paid_amount: number | null
          payment_date: string | null
          payment_method: string | null
          remaining_amount: number | null
          status: string
          total_amount: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_name: string
          description: string
          due_date: string
          id?: string
          notes?: string | null
          order_id?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          remaining_amount?: number | null
          status?: string
          total_amount: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          customer_name?: string
          description?: string
          due_date?: string
          id?: string
          notes?: string | null
          order_id?: string | null
          paid_amount?: number | null
          payment_date?: string | null
          payment_method?: string | null
          remaining_amount?: number | null
          status?: string
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_receivable_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_receivable_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      bom_components: {
        Row: {
          bom_id: string
          component_category: string
          component_name: string
          created_at: string
          id: string
          notes: string | null
          product_id: string | null
          quantity: number
          sort_order: number | null
          total_cost: number | null
          unit: string
          unit_cost: number
          waste_pct: number | null
        }
        Insert: {
          bom_id: string
          component_category?: string
          component_name: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity: number
          sort_order?: number | null
          total_cost?: number | null
          unit?: string
          unit_cost?: number
          waste_pct?: number | null
        }
        Update: {
          bom_id?: string
          component_category?: string
          component_name?: string
          created_at?: string
          id?: string
          notes?: string | null
          product_id?: string | null
          quantity?: number
          sort_order?: number | null
          total_cost?: number | null
          unit?: string
          unit_cost?: number
          waste_pct?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bom_components_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "boms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bom_components_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      bom_processes: {
        Row: {
          bom_id: string
          created_at: string
          description: string | null
          estimated_time: number
          id: string
          labor_cost_per_hour: number | null
          labor_cost_total: number | null
          name: string
          resource_name: string | null
          sequence: number
          setup_time: number | null
        }
        Insert: {
          bom_id: string
          created_at?: string
          description?: string | null
          estimated_time?: number
          id?: string
          labor_cost_per_hour?: number | null
          labor_cost_total?: number | null
          name: string
          resource_name?: string | null
          sequence?: number
          setup_time?: number | null
        }
        Update: {
          bom_id?: string
          created_at?: string
          description?: string | null
          estimated_time?: number
          id?: string
          labor_cost_per_hour?: number | null
          labor_cost_total?: number | null
          name?: string
          resource_name?: string | null
          sequence?: number
          setup_time?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bom_processes_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "boms"
            referencedColumns: ["id"]
          },
        ]
      }
      boms: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          labor_cost: number | null
          margin_pct: number | null
          notes: string | null
          overhead_cost: number | null
          product_id: string
          product_name: string
          profit_value: number | null
          sale_price: number | null
          status: string
          total_cost: number | null
          total_material_cost: number | null
          total_time: number | null
          updated_at: string
          version: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          labor_cost?: number | null
          margin_pct?: number | null
          notes?: string | null
          overhead_cost?: number | null
          product_id: string
          product_name: string
          profit_value?: number | null
          sale_price?: number | null
          status?: string
          total_cost?: number | null
          total_material_cost?: number | null
          total_time?: number | null
          updated_at?: string
          version?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          labor_cost?: number | null
          margin_pct?: number | null
          notes?: string | null
          overhead_cost?: number | null
          product_id?: string
          product_name?: string
          profit_value?: number | null
          sale_price?: number | null
          status?: string
          total_cost?: number | null
          total_material_cost?: number | null
          total_time?: number | null
          updated_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "boms_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_accounts: {
        Row: {
          account_number: string | null
          agency: string | null
          bank: string | null
          created_at: string
          current_balance: number
          id: string
          is_active: boolean | null
          name: string
          opening_balance: number
          type: string
          updated_at: string
        }
        Insert: {
          account_number?: string | null
          agency?: string | null
          bank?: string | null
          created_at?: string
          current_balance?: number
          id?: string
          is_active?: boolean | null
          name: string
          opening_balance?: number
          type?: string
          updated_at?: string
        }
        Update: {
          account_number?: string | null
          agency?: string | null
          bank?: string | null
          created_at?: string
          current_balance?: number
          id?: string
          is_active?: boolean | null
          name?: string
          opening_balance?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      cash_categories: {
        Row: {
          color: string | null
          created_at: string
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          color?: string | null
          created_at?: string
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      cash_entries: {
        Row: {
          amount: number
          cash_account_id: string
          category_id: string | null
          created_at: string
          created_by: string | null
          customer_id: string | null
          date: string
          description: string
          document_number: string | null
          due_date: string | null
          id: string
          notes: string | null
          payment_date: string | null
          payment_method: string | null
          production_order_id: string | null
          sales_order_id: string | null
          status: string
          supplier_id: string | null
          type: string
          updated_at: string
        }
        Insert: {
          amount: number
          cash_account_id: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          date?: string
          description: string
          document_number?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          production_order_id?: string | null
          sales_order_id?: string | null
          status?: string
          supplier_id?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          cash_account_id?: string
          category_id?: string | null
          created_at?: string
          created_by?: string | null
          customer_id?: string | null
          date?: string
          description?: string
          document_number?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          payment_date?: string | null
          payment_method?: string | null
          production_order_id?: string | null
          sales_order_id?: string | null
          status?: string
          supplier_id?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cash_entries_cash_account_id_fkey"
            columns: ["cash_account_id"]
            isOneToOne: false
            referencedRelation: "cash_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_entries_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cash_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_entries_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_entries_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_entries_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cash_entries_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          city: string | null
          cnpj: string | null
          code: string
          complement: string | null
          created_at: string
          email: string | null
          id: string
          ie: string | null
          is_headquarters: boolean | null
          name: string
          neighborhood: string | null
          number: string | null
          phone: string | null
          state: string | null
          status: string
          street: string | null
          trade_name: string | null
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          cnpj?: string | null
          code: string
          complement?: string | null
          created_at?: string
          email?: string | null
          id?: string
          ie?: string | null
          is_headquarters?: boolean | null
          name: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          street?: string | null
          trade_name?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          cnpj?: string | null
          code?: string
          complement?: string | null
          created_at?: string
          email?: string | null
          id?: string
          ie?: string | null
          is_headquarters?: boolean | null
          name?: string
          neighborhood?: string | null
          number?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          street?: string | null
          trade_name?: string | null
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          category: string | null
          city: string | null
          code: string
          complement: string | null
          cpf_cnpj: string | null
          created_at: string
          created_by: string | null
          credit_limit: number | null
          email: string | null
          id: string
          ie: string | null
          mobile: string | null
          name: string
          neighborhood: string | null
          notes: string | null
          number: string | null
          payment_term: string | null
          phone: string | null
          state: string | null
          status: string
          street: string | null
          trade_name: string | null
          type: string
          updated_at: string
          website: string | null
          zip_code: string | null
        }
        Insert: {
          category?: string | null
          city?: string | null
          code: string
          complement?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          ie?: string | null
          mobile?: string | null
          name: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          payment_term?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          street?: string | null
          trade_name?: string | null
          type?: string
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Update: {
          category?: string | null
          city?: string | null
          code?: string
          complement?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          created_by?: string | null
          credit_limit?: number | null
          email?: string | null
          id?: string
          ie?: string | null
          mobile?: string | null
          name?: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          payment_term?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          street?: string | null
          trade_name?: string | null
          type?: string
          updated_at?: string
          website?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          available_stock: number | null
          avg_cost: number
          created_at: string
          current_stock: number
          id: string
          last_movement: string | null
          location: string | null
          max_stock: number
          min_stock: number
          product_category: string
          product_code: string
          product_id: string
          product_name: string
          reserved_stock: number | null
          status: string | null
          total_value: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          available_stock?: number | null
          avg_cost?: number
          created_at?: string
          current_stock?: number
          id?: string
          last_movement?: string | null
          location?: string | null
          max_stock?: number
          min_stock?: number
          product_category: string
          product_code: string
          product_id: string
          product_name: string
          reserved_stock?: number | null
          status?: string | null
          total_value?: number | null
          unit?: string
          updated_at?: string
        }
        Update: {
          available_stock?: number | null
          avg_cost?: number
          created_at?: string
          current_stock?: number
          id?: string
          last_movement?: string | null
          location?: string | null
          max_stock?: number
          min_stock?: number
          product_category?: string
          product_code?: string
          product_id?: string
          product_name?: string
          reserved_stock?: number | null
          status?: string | null
          total_value?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: true
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          created_at: string
          customization_notes: string | null
          delivery_date: string | null
          dimensions: string | null
          discount: number | null
          fabric_color: string | null
          fabric_type: string | null
          id: string
          margin_pct: number | null
          notes: string | null
          order_id: string
          product_code: string
          product_id: string | null
          product_name: string
          production_cost: number | null
          quantity: number
          total: number
          unit: string
          unit_price: number
        }
        Insert: {
          created_at?: string
          customization_notes?: string | null
          delivery_date?: string | null
          dimensions?: string | null
          discount?: number | null
          fabric_color?: string | null
          fabric_type?: string | null
          id?: string
          margin_pct?: number | null
          notes?: string | null
          order_id: string
          product_code: string
          product_id?: string | null
          product_name: string
          production_cost?: number | null
          quantity: number
          total: number
          unit?: string
          unit_price: number
        }
        Update: {
          created_at?: string
          customization_notes?: string | null
          delivery_date?: string | null
          dimensions?: string | null
          discount?: number | null
          fabric_color?: string | null
          fabric_type?: string | null
          id?: string
          margin_pct?: number | null
          notes?: string | null
          order_id?: string
          product_code?: string
          product_id?: string | null
          product_name?: string
          production_cost?: number | null
          quantity?: number
          total?: number
          unit?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          created_by: string | null
          customer_document: string | null
          customer_id: string | null
          customer_name: string
          delivered_date: string | null
          discount: number | null
          expected_delivery: string | null
          id: string
          internal_notes: string | null
          notes: string | null
          order_date: string
          order_number: string
          payment_method: string | null
          payment_term: string | null
          priority: string
          seller: string | null
          shipping: number | null
          shipping_city: string | null
          shipping_complement: string | null
          shipping_neighborhood: string | null
          shipping_number: string | null
          shipping_state: string | null
          shipping_street: string | null
          shipping_zip_code: string | null
          status: string
          subtotal: number
          tax: number | null
          total: number
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          customer_document?: string | null
          customer_id?: string | null
          customer_name: string
          delivered_date?: string | null
          discount?: number | null
          expected_delivery?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_date?: string
          order_number: string
          payment_method?: string | null
          payment_term?: string | null
          priority?: string
          seller?: string | null
          shipping?: number | null
          shipping_city?: string | null
          shipping_complement?: string | null
          shipping_neighborhood?: string | null
          shipping_number?: string | null
          shipping_state?: string | null
          shipping_street?: string | null
          shipping_zip_code?: string | null
          status?: string
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          created_by?: string | null
          customer_document?: string | null
          customer_id?: string | null
          customer_name?: string
          delivered_date?: string | null
          discount?: number | null
          expected_delivery?: string | null
          id?: string
          internal_notes?: string | null
          notes?: string | null
          order_date?: string
          order_number?: string
          payment_method?: string | null
          payment_term?: string | null
          priority?: string
          seller?: string | null
          shipping?: number | null
          shipping_city?: string | null
          shipping_complement?: string | null
          shipping_neighborhood?: string | null
          shipping_number?: string | null
          shipping_state?: string | null
          shipping_street?: string | null
          shipping_zip_code?: string | null
          status?: string
          subtotal?: number
          tax?: number | null
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      price_list_items: {
        Row: {
          base_price: number
          created_at: string
          final_price: number
          id: string
          price_list_id: string
          product_id: string
        }
        Insert: {
          base_price: number
          created_at?: string
          final_price: number
          id?: string
          price_list_id: string
          product_id: string
        }
        Update: {
          base_price?: number
          created_at?: string
          final_price?: number
          id?: string
          price_list_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "price_list_items_price_list_id_fkey"
            columns: ["price_list_id"]
            isOneToOne: false
            referencedRelation: "price_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "price_list_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      price_lists: {
        Row: {
          created_at: string
          created_by: string | null
          customer_category: string | null
          description: string | null
          discount_pct: number | null
          id: string
          is_active: boolean | null
          markup_pct: number | null
          name: string
          updated_at: string
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          customer_category?: string | null
          description?: string | null
          discount_pct?: number | null
          id?: string
          is_active?: boolean | null
          markup_pct?: number | null
          name: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          customer_category?: string | null
          description?: string | null
          discount_pct?: number | null
          id?: string
          is_active?: boolean | null
          markup_pct?: number | null
          name?: string
          updated_at?: string
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      product_suppliers: {
        Row: {
          created_at: string
          delivery_days: number | null
          id: string
          is_main: boolean | null
          last_purchase: string | null
          price: number
          product_id: string
          supplier_code: string | null
          supplier_id: string
        }
        Insert: {
          created_at?: string
          delivery_days?: number | null
          id?: string
          is_main?: boolean | null
          last_purchase?: string | null
          price?: number
          product_id: string
          supplier_code?: string | null
          supplier_id: string
        }
        Update: {
          created_at?: string
          delivery_days?: number | null
          id?: string
          is_main?: boolean | null
          last_purchase?: string | null
          price?: number
          product_id?: string
          supplier_code?: string | null
          supplier_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_suppliers_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_suppliers_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      production_appointments: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          operator: string
          production_order_id: string
          quantity_produced: number
          quantity_rejected: number | null
          stop_duration: number | null
          stop_reason: string | null
          timestamp: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          operator: string
          production_order_id: string
          quantity_produced?: number
          quantity_rejected?: number | null
          stop_duration?: number | null
          stop_reason?: string | null
          timestamp?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          operator?: string
          production_order_id?: string
          quantity_produced?: number
          quantity_rejected?: number | null
          stop_duration?: number | null
          stop_reason?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_appointments_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      production_orders: {
        Row: {
          actual_end_date: string | null
          ai_optimized: boolean | null
          bom_id: string | null
          created_at: string
          created_by: string | null
          efficiency: number | null
          expected_end_date: string | null
          id: string
          machine: string | null
          notes: string | null
          operator: string | null
          order_number: string
          priority: string
          product_code: string
          product_id: string | null
          product_name: string
          production_time: number | null
          quantity_planned: number
          quantity_produced: number | null
          quantity_rejected: number | null
          sales_order_id: string | null
          setup_time: number | null
          start_date: string | null
          status: string
          stop_time: number | null
          unit: string
          updated_at: string
        }
        Insert: {
          actual_end_date?: string | null
          ai_optimized?: boolean | null
          bom_id?: string | null
          created_at?: string
          created_by?: string | null
          efficiency?: number | null
          expected_end_date?: string | null
          id?: string
          machine?: string | null
          notes?: string | null
          operator?: string | null
          order_number: string
          priority?: string
          product_code: string
          product_id?: string | null
          product_name: string
          production_time?: number | null
          quantity_planned: number
          quantity_produced?: number | null
          quantity_rejected?: number | null
          sales_order_id?: string | null
          setup_time?: number | null
          start_date?: string | null
          status?: string
          stop_time?: number | null
          unit?: string
          updated_at?: string
        }
        Update: {
          actual_end_date?: string | null
          ai_optimized?: boolean | null
          bom_id?: string | null
          created_at?: string
          created_by?: string | null
          efficiency?: number | null
          expected_end_date?: string | null
          id?: string
          machine?: string | null
          notes?: string | null
          operator?: string | null
          order_number?: string
          priority?: string
          product_code?: string
          product_id?: string | null
          product_name?: string
          production_time?: number | null
          quantity_planned?: number
          quantity_produced?: number | null
          quantity_rejected?: number | null
          sales_order_id?: string | null
          setup_time?: number | null
          start_date?: string | null
          status?: string
          stop_time?: number | null
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "production_orders_bom_id_fkey"
            columns: ["bom_id"]
            isOneToOne: false
            referencedRelation: "boms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "production_orders_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          avg_cost: number
          barcode: string | null
          category: string
          code: string
          created_at: string
          created_by: string | null
          current_stock: number
          description: string | null
          gross_weight: number | null
          id: string
          lead_time: number | null
          max_stock: number
          min_stock: number
          name: string
          ncm: string | null
          net_weight: number | null
          photo_url: string | null
          production_notes: string | null
          production_time: number | null
          production_time_unit: string | null
          sale_price: number | null
          setup_time: number | null
          status: string
          type: string
          unit: string
          updated_at: string
          weight_unit: string | null
          yield_pct: number | null
        }
        Insert: {
          avg_cost?: number
          barcode?: string | null
          category: string
          code: string
          created_at?: string
          created_by?: string | null
          current_stock?: number
          description?: string | null
          gross_weight?: number | null
          id?: string
          lead_time?: number | null
          max_stock?: number
          min_stock?: number
          name: string
          ncm?: string | null
          net_weight?: number | null
          photo_url?: string | null
          production_notes?: string | null
          production_time?: number | null
          production_time_unit?: string | null
          sale_price?: number | null
          setup_time?: number | null
          status?: string
          type: string
          unit?: string
          updated_at?: string
          weight_unit?: string | null
          yield_pct?: number | null
        }
        Update: {
          avg_cost?: number
          barcode?: string | null
          category?: string
          code?: string
          created_at?: string
          created_by?: string | null
          current_stock?: number
          description?: string | null
          gross_weight?: number | null
          id?: string
          lead_time?: number | null
          max_stock?: number
          min_stock?: number
          name?: string
          ncm?: string | null
          net_weight?: number | null
          photo_url?: string | null
          production_notes?: string | null
          production_time?: number | null
          production_time_unit?: string | null
          sale_price?: number | null
          setup_time?: number | null
          status?: string
          type?: string
          unit?: string
          updated_at?: string
          weight_unit?: string | null
          yield_pct?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          email: string
          id: string
          name: string
          phone: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: []
      }
      stock_movements: {
        Row: {
          created_at: string
          date: string
          from_location: string | null
          id: string
          notes: string | null
          product_code: string
          product_id: string
          product_name: string
          production_order_id: string | null
          quantity: number
          reason: string | null
          reference_document: string | null
          sales_order_id: string | null
          to_location: string | null
          total_cost: number | null
          type: string
          unit_cost: number | null
          user_id: string | null
          user_name: string | null
        }
        Insert: {
          created_at?: string
          date?: string
          from_location?: string | null
          id?: string
          notes?: string | null
          product_code: string
          product_id: string
          product_name: string
          production_order_id?: string | null
          quantity: number
          reason?: string | null
          reference_document?: string | null
          sales_order_id?: string | null
          to_location?: string | null
          total_cost?: number | null
          type: string
          unit_cost?: number | null
          user_id?: string | null
          user_name?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          from_location?: string | null
          id?: string
          notes?: string | null
          product_code?: string
          product_id?: string
          product_name?: string
          production_order_id?: string | null
          quantity?: number
          reason?: string | null
          reference_document?: string | null
          sales_order_id?: string | null
          to_location?: string | null
          total_cost?: number | null
          type?: string
          unit_cost?: number | null
          user_id?: string | null
          user_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "stock_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_production_order_id_fkey"
            columns: ["production_order_id"]
            isOneToOne: false
            referencedRelation: "production_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stock_movements_sales_order_id_fkey"
            columns: ["sales_order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          city: string | null
          code: string
          complement: string | null
          contact_name: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          id: string
          ie: string | null
          mobile: string | null
          name: string
          neighborhood: string | null
          notes: string | null
          number: string | null
          payment_terms: string | null
          phone: string | null
          state: string | null
          status: string
          street: string | null
          trade_name: string | null
          type: string
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          code: string
          complement?: string | null
          contact_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          ie?: string | null
          mobile?: string | null
          name: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          street?: string | null
          trade_name?: string | null
          type?: string
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          code?: string
          complement?: string | null
          contact_name?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          id?: string
          ie?: string | null
          mobile?: string | null
          name?: string
          neighborhood?: string | null
          notes?: string | null
          number?: string | null
          payment_terms?: string | null
          phone?: string | null
          state?: string | null
          status?: string
          street?: string | null
          trade_name?: string | null
          type?: string
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      recalculate_bom_totals: { Args: { bom_uuid: string }; Returns: undefined }
    }
    Enums: {
      app_role: "admin" | "manager" | "operator" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "manager", "operator", "viewer"],
    },
  },
} as const
