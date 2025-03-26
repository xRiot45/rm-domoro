import EmptyImg from '@/assets/errors/empty.svg';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CashierLayout from '@/layouts/cashier/layout';
import { cn } from '@/lib/utils';
import { Carts } from '@/models/cart';
import { MenuItems } from '@/models/menu-items';
import { BreadcrumbItem } from '@/types';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Head, router } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart, Trash } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: '/cashier/menu',
    },
];

export default function MenuPage({ menuItems, carts }: { menuItems: MenuItems[]; carts: Carts[] }) {
    const addMenuItemToCart = (event: React.MouseEvent<HTMLButtonElement>, item: MenuItems) => {
        event.preventDefault();

        const newCartsData = {
            menu_item_id: item?.id,
            quantity: 1,
            unit_price: item?.price,
        };

        router.post(route('cashier.cart.store'), newCartsData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Menu berhasil ditambahkan ke keranjang',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Menu gagal ditambahkan ke keranjang',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <>
            <CashierLayout breadcrumbs={breadcrumbs}>
                <Head title="Menu" />
                <div className="mt-2 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="block items-center justify-between space-y-4 lg:flex">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Daftar Menu</h1>
                            <p className="text-muted-foreground mt-1.5 text-[16px]">Pilih menu yang tersedia dan tambahkan ke keranjang</p>
                        </div>

                        <Input placeholder="Cari menu" className="w-full lg:w-lg" />
                    </div>

                    <div className="relative mt-4 space-x-6 lg:flex">
                        {/* Menu Feed Start */}
                        {menuItems?.length > 0 ? (
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
                                                <span className="text-sm font-medium text-gray-600 italic dark:text-gray-200">
                                                    {item?.menu_category?.name}
                                                </span>
                                            </div>
                                            <div className="mt-4">
                                                <Button
                                                    onClick={(e) => addMenuItemToCart(e, item)}
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
                        ) : (
                            <div className="mx-auto flex h-full w-full flex-col items-center justify-center">
                                <img src={EmptyImg} alt="Error" className="mx-auto h-96 w-96" />
                                <p className="text-md text-center font-black text-gray-500">Menu Sedang Kosong</p>
                            </div>
                        )}
                        {/* Menu Feed End */}

                        {/* Cart Sidebar */}
                        <CartSidebar cartItems={carts} />
                    </div>
                </div>
            </CashierLayout>
        </>
    );
}

function CartSidebar({ cartItems }: { cartItems: Carts[] }) {
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

function CartContent({ cartItems }: { cartItems: Carts[] }) {
    const subtotal = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    const total = subtotal;

    const handleDeleteItemFromCart = (cartId: number) => {
        router.delete(route('cashier.cart.destroy', { id: cartId }), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Menu Berhasil Dihapus!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Menghapus Menu',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    const handleDeleteAllItemFromCart = () => {
        router.delete(route('cashier.cart.destroy_all'), {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Berhasil Menghapus Semua Menu Dari Keranjang',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: errors.message || 'Gagal Menghapus Semua Menu Dari Keranjang',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

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
                                    className="cursor-pointer text-black transition-all hover:bg-gray-200 dark:text-white dark:hover:bg-gray-800"
                                    variant="ghost"
                                >
                                    <Minus size={16} />
                                </Button>
                                <span>{item?.quantity}</span>
                                <Button
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
                        <img src={EmptyImg} alt="Error" className="mx-auto h-64 w-64" />
                        <p className="text-md text-center font-black text-gray-500">Keranjang kosong</p>
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
