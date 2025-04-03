import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentMethodEnum } from '@/enums/payment-method';
import { PaymentStatusEnum } from '@/enums/payment-status';
import { Cashier } from './cashier';
import { Chef } from './chef';
import { Courier } from './courier';
import { Customer } from './customer';
import { TransactionItem } from './transaction-item';

interface Transaction {
    id: number;
    order_number: string;
    customer_id?: number | null;
    customer: Customer;
    cashier_id?: number | null;
    cashier: Cashier;
    order_type?: OrderTypeEnum | null;
    payment_method?: PaymentMethodEnum | null;
    payment_status?: PaymentStatusEnum | null;
    cash_received?: number | null;
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
    created_at?: string;
    updated_at?: string;
}

export type { Transaction };
