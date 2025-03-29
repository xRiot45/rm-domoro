import { MenuItems } from './menu-items';
import { User } from './user';

interface Wishlist {
    id: number;
    user_id: number;
    user: User;
    menu_item_id: number;
    menu_item: MenuItems;
}

export type { Wishlist };
