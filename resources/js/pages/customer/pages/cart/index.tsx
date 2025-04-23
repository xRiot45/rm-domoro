import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app/layout';
import { Carts } from '@/models/cart';
import { Customer } from '@/models/customer';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Head, Link } from '@inertiajs/react';
import { AlertCircle, Minus, Plus, Trash } from 'lucide-react';
import { useCart } from '../../hooks/use-cart';
import EmptyState from './empty-state';

interface CartPageProps {
    carts: Carts[];
    customer: Customer;
}

export default function CartPage({ carts, customer }: CartPageProps) {
    const { handleDeleteAllItemFromCart, handleDeleteItemFromCart, handleUpdateQuantity, handleCheckout } = useCart();
    const subtotal = carts.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    const total = subtotal;

    const isAddressIncomplete = !customer?.address || !customer?.address_label?.trim();

    return (
        <>
            <AppLayout>
                <Head title="Keranjang" />
                <div className="my-8 flex flex-wrap justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-black tracking-tight text-gray-700 dark:text-gray-200">Daftar Keranjang Anda</h2>
                        <p className="text-muted-foreground mt-1.5 text-[14px]">Kelola menu yang ada di dalam keranjang anda</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {isAddressIncomplete && (
                        <Alert variant="destructive" className="rounded-xl p-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-bold">Alamat Belum Diisi</AlertTitle>
                            <AlertDescription>
                                Silakan isi alamat pengiriman terlebih dahulu di halaman profil Anda agar bisa melakukan proses checkout.
                                <Link href={route('customer.profile.index_profile')}>
                                    <Button variant="destructive" className="mt-2 cursor-pointer">
                                        Isi Alamat Sekarang
                                    </Button>
                                </Link>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        {/* Section Cart */}
                        <Card className={`w-full border-1 p-6 shadow-none ${carts.length > 0 ? 'lg:col-span-2 lg:border' : 'lg:col-span-3'}`}>
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-bold">Keranjang</h2>
                                <Button className="text-sm" variant="destructive" onClick={handleDeleteAllItemFromCart}>
                                    Hapus semua
                                </Button>
                            </div>
                            <Separator />
                            <ScrollArea className="h-[400px] w-full">
                                {carts.length > 0 ? (
                                    carts.map((item) => (
                                        <div key={item?.id}>
                                            <div className="mb-8 flex items-center gap-4">
                                                <Button
                                                    className="h-8 w-8 cursor-pointer text-red-500 transition-all hover:bg-gray-200 dark:hover:bg-gray-800"
                                                    variant="ghost"
                                                    onClick={() => handleDeleteItemFromCart(item?.id)}
                                                >
                                                    <Trash size={16} />
                                                </Button>
                                                <img
                                                    src={`${item?.menu_item?.image_url}`}
                                                    alt={item?.menu_item?.name}
                                                    className="h-16 w-16 rounded-md object-cover"
                                                />
                                                <div className="flex-1">
                                                    <h3 className="text-sm font-bold">{item?.menu_item?.name}</h3>
                                                    <p className="mb-1 text-sm text-gray-500">{`${formatCurrency(item?.unit_price)} × ${item.quantity}`}</p>
                                                    <p className="text-sm font-bold">{formatCurrency(item?.unit_price * item.quantity)}</p>
                                                </div>

                                                <div className="flex items-center gap-3 pe-2">
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
                                            <Separator className="my-4" />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <EmptyState description="Keranjang kosong" />
                                    </>
                                )}
                            </ScrollArea>
                        </Card>

                        {/* Section Total */}
                        {carts.length > 0 && (
                            <div className="flex w-full flex-col rounded-lg border p-4 md:col-span-1">
                                <div className="my-4 text-sm">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span>{formatCurrency(subtotal)}</span>
                                    </div>
                                </div>
                                <Separator />
                                <div className="mt-4 flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span>{formatCurrency(total)}</span>
                                </div>
                                <Button className="mt-8 w-full cursor-pointer py-5 text-white dark:bg-white dark:text-black" onClick={handleCheckout}>
                                    <Icon icon={'material-symbols:shopping-cart-checkout'} />
                                    Checkout Pesanan
                                </Button>
                                <Link href="/">
                                    <Button variant="outline" className="mt-2 w-full cursor-pointer py-5 text-black dark:bg-white dark:text-black">
                                        <Icon icon={'material-symbols:arrow-back'} />
                                        Kembali Ke Beranda
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </AppLayout>
        </>
    );
}

function CartContent({ cartItems, customer }: { cartItems: Carts[]; customer: Customer }) {
    const { handleDeleteAllItemFromCart, handleDeleteItemFromCart, handleUpdateQuantity, handleCheckout } = useCart();
    const subtotal = cartItems.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);
    const total = subtotal;

    console.log(customer);

    return (
        <div className="space-y-4">
            {(!customer?.address || customer?.address_label.trim() === '') && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Alamat Belum Diisi</AlertTitle>
                    <AlertDescription>
                        Silakan isi alamat pengiriman terlebih dahulu di halaman profil Anda.
                        <Link href={route('customer.profile.index_profile')}>
                            <Button variant="destructive" className="mt-2 cursor-pointer">
                                Isi Alamat Sekarang
                            </Button>
                        </Link>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Section Cart */}
                <Card className={`w-full border-1 p-6 shadow-none ${cartItems.length > 0 ? 'lg:col-span-2 lg:border' : 'lg:col-span-3'}`}>
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Keranjang</h2>
                        <Button className="text-sm" variant="destructive" onClick={handleDeleteAllItemFromCart}>
                            Hapus semua
                        </Button>
                    </div>
                    <Separator />
                    <ScrollArea className="h-[400px] w-full">
                        {cartItems.length > 0 ? (
                            cartItems.map((item) => (
                                <div key={item?.id}>
                                    <div className="mb-8 flex items-center gap-4">
                                        {/* <Button
                                        className="cursor-pointer text-red-500 transition-all hover:bg-gray-200 dark:hover:bg-gray-800"
                                        variant="ghost"
                                        onClick={() => handleDeleteItemFromCart(item?.id)}
                                    >
                                        <Trash size={16} />
                                    </Button> */}
                                        <img
                                            src={`${item?.menu_item?.image_url}`}
                                            alt={item?.menu_item?.name}
                                            className="h-16 w-16 rounded-md object-cover"
                                        />
                                        <div className="flex-1">
                                            <h3 className="text-sm font-bold">{item?.menu_item?.name}</h3>
                                            <p className="mb-1 text-sm text-gray-500">{`${formatCurrency(item?.unit_price)} × ${item.quantity}`}</p>
                                            <p className="text-sm font-bold">{formatCurrency(item?.unit_price * item.quantity)}</p>
                                        </div>

                                        <div className="flex items-center gap-4 md:pe-4">
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
                                    <Separator className="my-4" />
                                </div>
                            ))
                        ) : (
                            <>
                                <EmptyState description="Keranjang kosong" />
                            </>
                        )}
                    </ScrollArea>
                </Card>

                {/* Section Total */}
                {cartItems.length > 0 && (
                    <div className="flex w-full flex-col rounded-lg border p-4 md:col-span-1">
                        <div className="my-4 text-sm">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                        </div>
                        <Separator />
                        <div className="mt-4 flex justify-between text-lg font-bold">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <Button className="mt-8 w-full cursor-pointer py-5 text-white dark:bg-white dark:text-black" onClick={handleCheckout}>
                            <Icon icon={'material-symbols:shopping-cart-checkout'} />
                            Checkout Pesanan
                        </Button>
                        <Link href="/">
                            <Button variant="outline" className="mt-2 w-full cursor-pointer py-5 text-black dark:bg-white dark:text-black">
                                <Icon icon={'material-symbols:arrow-back'} />
                                Kembali Ke Beranda
                            </Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
