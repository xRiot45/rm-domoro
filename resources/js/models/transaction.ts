import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentStatusEnum } from '@/enums/payment-status';
import { PaymentTypeEnum } from '@/enums/payment-type';
import { Cashier } from './cashier';
import { Chef } from './chef';
import { Courier } from './courier';
import { Customer } from './customer';
import { OrderStatus } from './order-status';
import { TransactionItem } from './transaction-item';

interface Transaction {
    id: number;
    order_number: string;
    customer_id?: number | null;
    customer: Customer;
    cashier_id?: number | null;
    cashier: Cashier;
    order_type?: OrderTypeEnum | null;
    payment_method?: PaymentTypeEnum | null;
    payment_status?: PaymentStatusEnum | null;
    cash_received?: number | null;
    change?: number | null;
    table_number?: string | null;
    note?: string | null;
    chef_id: number;
    chef: Chef;
    courier_id?: number | null;
    courier: Courier;
    total_price: number;
    delivery_fee: number;
    service_charge: number;
    discount: number;
    tax: number;
    final_total: number;
    transaction_items: TransactionItem[];
    recipient?: string | null;
    recipient_phone_number?: string | null;
    shipping_address?: string | null;
    order_status: OrderStatus[];
    checked_out_at?: string;
    order_sent_to_chef_at?: string;
    order_sent_to_courier_at?: string;
    created_at?: string;
    updated_at?: string;
}

interface TransactionForm {
    transaction_id: number;
    order_type: OrderTypeEnum;
    payment_method: PaymentTypeEnum;
    cash_received: number;
    table_number: string;
    recipient: string;
    recipient_phone_number: string;
    shipping_address: string;
    note: string;
}

export type { Transaction, TransactionForm };
