import { MenuItems } from '@/models/menu-items';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

export function useCart() {
    const addMenuToCart = (item: MenuItems) => {
        const newCartItem = {
            menu_item_id: item?.id,
            quantity: 1,
            unit_price: item?.price,
        };

        router.post(route('cart.store'), newCartItem, {
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

    const handleUpdateQuantity = (cartId: number, increment: boolean) => {
        router.put(route('cart.update_quantity', { id: cartId }), { increment });
    };

    const handleDeleteItemFromCart = (cartId: number) => {
        router.delete(route('cart.destroy', { id: cartId }), {
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
        router.delete(route('cart.destroy_all'), {
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

    const handleCheckout = () => {
        router.post(
            route('checkout.store'),
            {},
            {
                onSuccess: (page) => {
                    const transactionId = (page?.props?.data as { id: number })?.id;
                    router.visit(route('checkout.index', { id: transactionId }));
                },
                onError: (errors) => {
                    toast.error('Checkout gagal', {
                        description: errors.message || 'Terjadi kesalahan.',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

    return { addMenuToCart, handleUpdateQuantity, handleDeleteItemFromCart, handleDeleteAllItemFromCart, handleCheckout };
}
