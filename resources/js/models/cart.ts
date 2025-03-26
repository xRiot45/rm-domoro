import { MenuItems } from './menu-items';

interface Carts {
    id: number;
    cashier_id?: number | null;
    customer_id?: number | null;
    menu_item: MenuItems;
    menu_item_id: number;
    quantity: number;
    unit_price: number;
    created_at: string;
    updated_at: string;
}

interface CartForm {
    menu_item_id: number;
    quantity: number;
    unit_price: number;
}

export type { CartForm, Carts };
