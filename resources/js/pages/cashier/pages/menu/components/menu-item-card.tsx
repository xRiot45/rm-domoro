import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuItems } from '@/models/menu-items';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { useCart } from '../hooks/use-cart';

interface MenuItemCardProps {
    menuItems: MenuItems[];
}

export default function MenuItemCard({ menuItems }: MenuItemCardProps) {
    const { addMenuToCart } = useCart();

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
                            <div className="flex justify-between">
                                <div>
                                    <h1 className="mb-1 truncate font-bold">{item?.name}</h1>
                                    <span className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {formatCurrency(Number(item?.price))}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-gray-600 italic dark:text-gray-200">{item?.menu_category?.name}</span>
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
            </div>
        </>
    );
}
