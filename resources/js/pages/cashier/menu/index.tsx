import EmptyImg from '@/assets/errors/empty.svg';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import CashierLayout from '@/layouts/cashier/layout';
import { cn } from '@/lib/utils';
import { MenuItems } from '@/models/menu-items';
import { BreadcrumbItem } from '@/types';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Menu',
        href: '/cashier/menu',
    },
];

export default function MenuPage({ data }: { data: MenuItems[] }) {
    return (
        <>
            <CashierLayout breadcrumbs={breadcrumbs}>
                <Head title="Menu" />
                <div className="mt-2 flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="block items-center justify-between space-y-4 lg:flex">
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Daftar Menu</h1>
                            <p className="text-muted-foreground mt-1.5 text-[16px]">Pilih menu yang tersedia dan tambahkan ke keranjang.</p>
                        </div>

                        <Input placeholder="Cari menu" className="w-full lg:w-lg" />
                    </div>

                    <div className="relative mt-4 space-x-6 lg:flex">
                        {/* Menu Feed Start */}
                        {data?.length > 0 ? (
                            <div className="grid w-full flex-1 auto-rows-min gap-6 space-y-5 md:grid-cols-3 lg:grid-cols-4">
                                {data?.map(
                                    (
                                        item,
                                        index, // Tambahkan {} di sini
                                    ) => (
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
                                                <h1 className="mb-1 truncate font-bold">{item?.name}</h1>
                                                <span className="flex items-center text-sm font-medium text-gray-800">
                                                    {formatCurrency(Number(item?.price))}
                                                </span>
                                                <div className="mt-4">
                                                    <Button
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
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="mx-auto flex h-full w-full flex-col items-center justify-center">
                                <img src={EmptyImg} alt="Error" className="mx-auto h-96 w-96" />
                                <p className="text-md text-center font-black text-gray-500">Menu Sedang Kosong</p>
                            </div>
                        )}
                        {/* Menu Feed End */}

                        {/* Cart Sidebar */}
                        <CartSidebar cartItems={data} />
                    </div>
                </div>
            </CashierLayout>
        </>
    );
}

function CartSidebar({ cartItems }) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;
    console.log(total);

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
                    <DrawerContent className="flex min-h-[20vh] flex-col justify-between p-4">
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

function CartContent({ cartItems }) {
    const subtotal = cartItems.reduce((sum: number, item) => sum + item.price * (item.quantity || 1), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    return (
        <Card className="w-full max-w-lg border-0 shadow-none lg:border lg:p-6">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Keranjang</h2>
                <button className="text-sm text-gray-500 hover:text-gray-700">Hapus semua</button>
            </div>
            <Separator />
            <ScrollArea className="h-[35vh]">
                {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 space-y-8">
                            <img src={item.image_url} alt={item.name} className="h-16 w-16 rounded-md object-cover" />
                            <div className="flex-1">
                                <h3 className="text-sm font-bold">{item.name}</h3>
                                <p className="mb-1 text-sm text-gray-500">{`${formatCurrency(item.price)} × ${item.quantity}`}</p>
                                <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2 pe-4">
                                <button className="cursor-pointer rounded-full bg-gray-100 p-1 hover:bg-gray-300 dark:text-black">
                                    <Minus size={16} />
                                </button>
                                <span>{item.quantity}</span>
                                <button className="cursor-pointer rounded-full bg-gray-100 p-1 hover:bg-gray-300 dark:text-black">
                                    <Plus size={16} />
                                </button>
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
                <div className="flex justify-between">
                    <span>Delivery</span>
                    <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
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
