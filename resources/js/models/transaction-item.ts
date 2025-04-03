import { MenuItems } from './menu-items';

interface TransactionItem {
    id: number;
    transaction_id: number;
    menu_item_id: number;
    quantity: number;
    unit_price: number;
    subtotal: number;
    menu_item: MenuItems;
}

export type { TransactionItem };
