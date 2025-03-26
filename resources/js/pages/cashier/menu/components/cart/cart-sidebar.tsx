import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Carts } from '@/models/cart';
import { ShoppingCart } from 'lucide-react';
import CartContent from './cart-content';

interface CartSidebarProps {
    cartItems: Carts[];
}

export default function CartSidebar({ cartItems }: CartSidebarProps) {
    return (
        <>
            {/* Tombol untuk Mobile & Tablet */}
            <div className="fixed right-0 bottom-1/2 z-50 lg:hidden">
                <Drawer direction="right">
                    <DrawerTrigger>
                        <Button className="flex cursor-pointer flex-col items-center gap-2 p-8">
                            <ShoppingCart size={20} />
                            {cartItems.length} Menu
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="flex min-h-[20vh] flex-col justify-between p-4 data-[vaul-drawer-direction=right]:sm:max-w-lg">
                        <CartContent cartItems={cartItems} />
                    </DrawerContent>
                </Drawer>
            </div>

            {/* Sidebar untuk Desktop */}
            <div className="hidden w-full max-w-lg shadow-none lg:sticky lg:top-0 lg:block lg:max-h-[80vh]">
                <CartContent cartItems={cartItems} />
            </div>
        </>
    );
}
