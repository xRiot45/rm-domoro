import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuItems } from '@/models/menu-items';
import { User } from '@/models/user';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { usePage } from '@inertiajs/react';
import { useCart } from '../hooks/use-cart';

interface MenuItemCardProps {
    menuItems: MenuItems[];
}

export default function MenuItemCard({ menuItems }: MenuItemCardProps) {
    const { props } = usePage<{ auth: { user: User } }>();
    const user = props.auth?.user;
    const { addMenuToCart } = useCart();

    return (
        <>
            <div className="mb-20 grid w-full flex-1 auto-rows-min grid-cols-2 gap-6 space-y-5 md:grid-cols-2 lg:grid-cols-3">
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
                                    <span className="text-muted-foreground text-sm font-medium italic dark:text-gray-200">
                                        {item?.menu_category?.name}
                                    </span>
                                    <h1 className="my-1 truncate font-bold">{item?.name}</h1>
                                    <span className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-200">
                                        {formatCurrency(Number(item?.price))}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-2">
                                <Button
                                    onClick={() => (user ? addMenuToCart(item) : null)}
                                    disabled={!user || item?.status === 'habis'}
                                    className={cn(
                                        'w-full cursor-pointer rounded-md py-5 text-white shadow-none transition-all',
                                        !user
                                            ? 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                                            : item?.status === 'habis'
                                              ? 'cursor-not-allowed bg-gray-400 dark:bg-gray-600'
                                              : 'bg-black hover:opacity-100 dark:bg-white dark:text-black dark:hover:opacity-50',
                                    )}
                                >
                                    <Icon
                                        icon={user ? (item?.status === 'habis' ? 'ph:empty-duotone' : 'mdi:cart-outline') : 'mdi:login'}
                                        className="text-background"
                                    />
                                    {!user ? 'Login terlebih dahulu' : item?.status === 'habis' ? 'Habis' : 'Tambah'}
                                </Button>

                                {user && (
                                    <Button className="w-full cursor-pointer py-5" variant="outline">
                                        <Icon icon="mdi:star-outline" className="text-black dark:text-white" />
                                        Beri Rating
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
