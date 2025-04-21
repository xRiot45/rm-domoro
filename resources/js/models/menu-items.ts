import { MenuCategory } from './menu-categories';

export enum MenuItemStatusEnum {
    AVAILABLE = 'tersedia',
    UNAVAILABLE = 'habis',
}

interface MenuItems {
    id: number;
    name: string;
    price: number;
    image_url: File | null;
    status: MenuItemStatusEnum;
    menu_category_id: number;
    menu_category: MenuCategory;
    ingredients: string[];
    created_at?: string;
    updated_at?: string;
}

interface MenuItemForm {
    name: string;
    price: number;
    image_url: string | File | null;
    status: MenuItemStatusEnum;
    ingredients: string[];
    menu_category_id: number;
}

export type { MenuItemForm, MenuItems };
