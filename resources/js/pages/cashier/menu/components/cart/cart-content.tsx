import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Carts } from '@/models/cart';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Minus, Plus, Trash } from 'lucide-react';
import { useCart } from '../../hooks/use-cart';
import EmptyState from './empty-state';

interface CartContentProps {
    cartItems: Carts[];
}

export default function CartContent({ cartItems }: CartContentProps) {
    const { handleDeleteAllItemFromCart, handleDeleteItemFromCart, handleUpdateQuantity } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    const total = subtotal;

    return (
        <Card className="w-full max-w-lg border-0 shadow-none lg:border lg:p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Keranjang</h2>
                <Button className="text-sm" variant="destructive" onClick={handleDeleteAllItemFromCart}>
                    Hapus semua
                </Button>
            </div>
            <Separator />
            <ScrollArea className="h-[40vh]">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div key={item?.id} className="flex items-center gap-4 space-y-8">
                            <Button
                                className="cursor-pointer text-red-500 transition-all hover:bg-gray-200 dark:hover:bg-gray-800"
                                variant="ghost"
                                onClick={() => handleDeleteItemFromCart(item?.id)}
                            >
                                <Trash size={16} />
                            </Button>
                            <img src={`${item?.menu_item?.image_url}`} alt={item?.menu_item?.name} className="h-16 w-16 rounded-md object-cover" />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold">{item?.menu_item?.name}</h3>
                                <p className="mb-1 text-sm text-gray-500">{`${formatCurrency(item?.unit_price)} × ${item.quantity}`}</p>
                                <p className="text-sm font-bold">{formatCurrency(item?.unit_price * item.quantity)}</p>
                            </div>

                            <div className="flex items-center gap-2 pe-4">
                                <Button
                                    onClick={() => handleUpdateQuantity(item?.id, false)}
                                    className="cursor-pointer text-black transition-all hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800"
                                    variant="ghost"
                                >
                                    <Minus size={16} />
                                </Button>
                                <span>{item?.quantity}</span>
                                <Button
                                    onClick={() => handleUpdateQuantity(item?.id, true)}
                                    className="cursor-pointer text-black transition-all hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800"
                                    variant="ghost"
                                >
                                    <Plus size={16} />
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <>
                        <EmptyState description="Keranjang kosong" />
                    </>
                )}
            </ScrollArea>
            <Separator />
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
            </div>
            <Button className="mt-4 w-full cursor-pointer py-5 text-white dark:bg-white dark:text-black">
                <Icon icon={'lets-icons:order'} />
                Order Sekarang
            </Button>
        </Card>
    );
}
