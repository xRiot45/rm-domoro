import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { MenuItems } from '@/models/menu-items';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { useCart } from '../hooks/use-cart';

interface MenuItemCardProps {
    menuItems: MenuItems[];
}

const MenuItemCard: React.FC<MenuItemCardProps> = ({ menuItems }) => {
    const { addMenuToCart } = useCart();

    const [selectedItem, setSelectedItem] = useState<MenuItems | null>(null);

    return (
        <>
            <div className="grid w-full flex-1 auto-rows-min gap-6 space-y-5 md:grid-cols-3 lg:grid-cols-4">
                {menuItems?.map((item, index) => (
                    <div key={index} className={cn('pb-0.5')}>
                        <div className="relative">
                            <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-md">
                                <img
                                    alt={item?.name}
                                    src={`${item?.image_url}`}
                                    sizes="(max-width: 768px) 100vw"
                                    className={cn(
                                        'h-full w-full object-cover transition-all',
                                        item?.status === 'habis' ? 'opacity-50 grayscale' : '',
                                    )}
                                />
                            </div>
                        </div>
                        <div className="pt-3">
                            <div className="flex cursor-pointer justify-between" onClick={() => setSelectedItem(item)}>
                                <div>
                                    <h1 className="mb-1 truncate font-bold">{item?.name}</h1>
                                    <span className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {formatCurrency(Number(item?.price))}
                                    </span>
                                </div>
                                <span className="text-sm font-medium dark:text-gray-200">{item?.menu_category?.name}</span>
                            </div>
                            <div className="mt-4">
                                <Button
                                    onClick={() => addMenuToCart(item)}
                                    disabled={item?.status === 'habis'}
                                    className={cn(
                                        'w-full cursor-pointer rounded-md py-5 text-white shadow-none transition-all',
                                        item?.status === 'habis'
                                            ? 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                                            : 'bg-black hover:opacity-100 dark:bg-white dark:text-black dark:hover:opacity-50',
                                    )}
                                >
                                    {item?.status === 'habis' ? (
                                        <Icon icon={'ph:empty-duotone'} className="text-background" />
                                    ) : (
                                        <Icon icon={'mdi:cart-outline'} className="text-background" />
                                    )}
                                    {item?.status === 'habis' ? 'Habis' : 'Tambah ke Keranjang'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                    <DialogContent className="overflow-hidden rounded-xl border-none p-0 shadow-none dark:bg-zinc-900">
                        {selectedItem && (
                            <div className="flex flex-col bg-white md:flex-row dark:bg-zinc-900">
                                {/* Gambar */}
                                <div className="w-full md:w-1/2">
                                    <img src={`${selectedItem.image_url}`} alt={selectedItem.name} className="h-full w-full object-cover" />
                                </div>

                                {/* Detail */}
                                <div className="flex w-full flex-col justify-between space-y-4 p-6 md:w-1/2">
                                    <div className="space-y-4">
                                        <DialogHeader className="text-start">
                                            <DialogTitle className="text-xl font-bold text-black dark:text-white">{selectedItem.name}</DialogTitle>
                                            <DialogDescription className="text-muted-foreground text-sm dark:text-zinc-400">
                                                {selectedItem.menu_category.name}
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-semibold text-black dark:text-white">
                                                {formatCurrency(Number(selectedItem.price))}
                                            </p>
                                            <Badge variant={selectedItem.status === 'tersedia' ? 'default' : 'destructive'} className="capitalize">
                                                {selectedItem.status}
                                            </Badge>
                                        </div>

                                        <div>
                                            <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-zinc-200">Bahan-Bahan:</h4>
                                            <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-zinc-400">
                                                {selectedItem.ingredients.map((ingredient, index) => (
                                                    <li key={index}>{ingredient}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
};

export default MenuItemCard;
