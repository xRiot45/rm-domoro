import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
    const [selectedItem, setSelectedItem] = useState<MenuItems | null>(null);

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
        <div className="mb-20 grid w-full flex-1 auto-rows-min grid-cols-2 gap-5 space-y-5 md:grid-cols-2 lg:grid-cols-3">
            {menuItems?.map((item) => (
                <div key={item.id} className={cn('pb-0.5')}>
                    <div className="relative">
                        <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl">
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
                        <div onClick={() => setSelectedItem(item)} className="cursor-pointer">
                            <span className="text-sm font-medium dark:text-gray-200">{item?.menu_category?.name}</span>
                            <h1 className="my-1 truncate font-bold">{item?.name}</h1>

                            <span className="flex items-center text-sm font-medium text-gray-800 dark:text-gray-200">
                                {formatCurrency(Number(item?.price))}
                            </span>
                        </div>
                        <div className="mt-4 space-y-3">
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
                                <Icon icon={user ? (item?.status === 'habis' ? 'ph:empty-duotone' : 'mdi:cart-outline') : 'mdi:login'} />
                                {!user ? 'Login Dulu' : item?.status === 'habis' ? 'Habis' : 'Tambah'}
                            </Button>

                            {user && (
                                <Button className="w-full cursor-pointer py-5" variant="outline">
                                    <Icon icon="mdi:star-outline" className="text-black dark:text-white" />
                                    Beri Rating
                                </Button>
                            )}
                        </div>
                    </div>

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
                                                <DialogTitle className="text-xl font-bold text-black dark:text-white">
                                                    {selectedItem.name}
                                                </DialogTitle>
                                                <DialogDescription className="text-muted-foreground text-sm dark:text-zinc-400">
                                                    {selectedItem.menu_category.name}
                                                </DialogDescription>
                                            </DialogHeader>

                                            <div className="flex items-center justify-between">
                                                <p className="text-lg font-semibold text-black dark:text-white">
                                                    {formatCurrency(Number(selectedItem.price))}
                                                </p>
                                                <Badge
                                                    variant={selectedItem.status === 'tersedia' ? 'default' : 'destructive'}
                                                    className="capitalize"
                                                >
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
            ))}
        </div>
    );
}
