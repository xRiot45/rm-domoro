import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MenuItems } from '@/models/menu-items';
import { User } from '@/models/user';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useCart } from '../hooks/use-cart';

interface MenuItemCardProps {
    menuItems: MenuItems[];
}

export default function MenuItemCard({ menuItems }: MenuItemCardProps) {
    const { props } = usePage<{ auth: { user: User; wishlist: number[] } }>();
    const user = props.auth?.user;
    const { addMenuToCart } = useCart();

    const [wishlistItems, setWishlistItems] = useState<number[]>(props.auth?.wishlist || []);

    useEffect(() => {
        setWishlistItems(props.auth?.wishlist || []);
    }, [props.auth?.wishlist]);

    const toggleWishlist = async (menuItemId: number) => {
        router.post(
            route('wishlist.toggle'),
            { menu_item_id: menuItemId },
            {
                onSuccess: (response) => {
                    const status = (response.props.flash as { status: boolean | null })?.status;
                    setWishlistItems((prev) => (status ? [...prev, menuItemId] : prev.filter((id) => id !== menuItemId)));
                    toast.success('Success', {
                        description: status ? 'Menu berhasil ditambahkan ke wishlist' : 'Menu dihapus dari wishlist',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
                onError: (errors) => {
                    console.log(errors);
                    toast.error('Failed', {
                        description: errors.message || 'Terjadi kesalahan',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

    return (
        <div className="mb-20 grid w-full flex-1 auto-rows-min grid-cols-2 gap-6 space-y-5 md:grid-cols-2 lg:grid-cols-3">
            {menuItems?.map((item) => (
                <div key={item.id} className={cn('pb-0.5')}>
                    <div className="relative">
                        <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-md">
                            <img
                                alt={item?.name}
                                src={`${item?.image_url}`}
                                sizes="(max-width: 768px) 100vw"
                                className={cn('h-full w-full object-cover transition-all', item?.status === 'habis' ? 'opacity-50 grayscale' : '')}
                            />

                            {user && (
                                <button
                                    className="absolute top-3 right-3 cursor-pointer rounded-full bg-white p-3 shadow-md hover:bg-gray-200"
                                    onClick={() => toggleWishlist(item.id)}
                                >
                                    <Icon
                                        icon={wishlistItems.includes(item.id) ? 'mdi:heart' : 'mdi:heart-outline'}
                                        className={`text-xl ${wishlistItems.includes(item.id) ? 'text-red-500' : 'text-gray-500'}`}
                                    />
                                </button>
                            )}
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
    );
}
