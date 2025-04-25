import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { OrderStatusEnum } from '@/enums/order-status';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentStatusEnum } from '@/enums/payment-status';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Link, router } from '@inertiajs/react';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';
import { useState } from 'react';
import { toast } from 'sonner';

export function DataTableRowActions({
    row,
    onUpdateStatusOrder,
}: {
    row: Row<Transaction>;
    onUpdateStatusOrder: (transaction: Transaction) => void;
}) {
    const [showDialogChef, setShowDialogChef] = useState<boolean>(false);
    const [showDialogCourier, setShowDialogCourier] = useState<boolean>(false);
    const [isOrderSentToChef, setIsOrderSentToChef] = useState(!!row?.original?.order_sent_to_chef_at);
    const [isOrderSentToCourier, setIsOrderSentToCourier] = useState(!!row?.original?.order_sent_to_courier_at);
    const [showDialogPaymentCash, setShowDialogPaymentCash] = useState<boolean>(false);
    const [cashReceived, setCashReceived] = useState<number | string>('');

    const orderIsDelivery = row?.original?.order_type === OrderTypeEnum.DELIVERY;
    const orderIsDineIn = row?.original?.order_type === OrderTypeEnum.DINEIN;
    const orderIsPickup = row?.original?.order_type === OrderTypeEnum.PICKUP;
    const orderIsTakeaway = row?.original?.order_type === OrderTypeEnum.TAKEAWAY;

    const lastStatusOrder = row.original.order_status.at(-1)?.status;
    const isOrderPaymentPending = row?.original?.payment_status === PaymentStatusEnum.PENDING;

    const handleSendOrderToChef = () => {
        router.put(
            route('cashier.order.sendOrderToChef', { id: row.original.id }),
            {},
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Order berhasil dikirim ke Chef',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });

                    setIsOrderSentToChef(true);
                    router.reload({ only: ['unassignedOrders', 'myOrders'] });
                },
                onError: () => {
                    toast.error('Error', {
                        description: 'Gagal mengirim order ke Chef',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

    const handleSendOrderToCourier = () => {
        router.put(
            route('cashier.order.sendOrderToCourier', { id: row.original.id }),
            {},
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Order berhasil dikirim ke Kurir',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });

                    setIsOrderSentToCourier(true);
                    router.reload({ only: ['unassignedOrders', 'myOrders'] });
                },
                onError: () => {
                    toast.error('Error', {
                        description: 'Gagal mengirim order ke Kurir',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

    const handleOrderReadyToServe = () => {
        router.put(
            route('cashier.order.readyToServe', { id: row?.original?.id }),
            {},
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Pesanan Siap Disajikan',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });

                    router.reload();
                    onUpdateStatusOrder({
                        ...row.original,
                        order_status: [
                            ...row.original.order_status,
                            {
                                status: OrderStatusEnum.READY_TO_SERVE,
                            },
                        ],
                    });
                },

                onError: () => {
                    toast.error('Error', {
                        description: 'Pesanan Gagal Disajikan',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

    const handleOrderCompleted = () => {
        router.put(
            route('cashier.order.orderCompleted', { id: row?.original?.id }),
            {},
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Pesanan Selesai',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });

                    router.reload();
                    onUpdateStatusOrder({
                        ...row.original,
                        order_status: [
                            ...row.original.order_status,
                            {
                                status: OrderStatusEnum.COMPLETED,
                            },
                        ],
                    });
                },

                onError: () => {
                    toast.error('Error', {
                        description: 'Pesanan Gagal Selesai',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });
                },
            },
        );
    };

    const handlePaymentCash = () => {
        router.put(
            route('cashier.order.confirmSelfOrderCashPayment', { id: row?.original?.id }),
            { cash_received: cashReceived },
            {
                onSuccess: () => {
                    toast.success('Success', {
                        description: 'Pembayaran Tunai Berhasil',
                        action: {
                            label: 'Tutup',
                            onClick: () => toast.dismiss(),
                        },
                    });

                    onUpdateStatusOrder({
                        ...row.original,
                        order_status: [...row.original.order_status, { status: OrderStatusEnum.COMPLETED }],
                        payment_status: PaymentStatusEnum.PAID,
                    });
                },
                onError: () => {
                    toast.error('Error', {
                        description: 'Pembayaran Tunai Gagal',
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
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="ghost" className="data-[state=open]:bg-muted flex h-8 w-8 p-0">
                        <DotsHorizontalIcon className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[300px]">
                    <Link href={route('cashier.order.orderDetails', { id: row.original.id })}>
                        <DropdownMenuItem className="cursor-pointer">
                            Lihat Detail Pesanan
                            <DropdownMenuShortcut>
                                <Icon icon={'material-symbols:info'} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                    </Link>

                    {isOrderPaymentPending && (
                        <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDialogPaymentCash(true)}>
                                Masukkan Pembayaran Tunai
                                <DropdownMenuShortcut>
                                    <Icon icon={'material-symbols:attach-money'} />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    {!isOrderSentToChef && (
                        <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDialogChef(true)}>
                                Kirim ke Chef
                                <DropdownMenuShortcut>
                                    <Icon icon={'material-symbols:send'} />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}
                    {orderIsDelivery && lastStatusOrder === OrderStatusEnum.COOKED && !isOrderSentToCourier && (
                        <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => setShowDialogCourier(true)}>
                                Kirim ke Kurir
                                <DropdownMenuShortcut>
                                    <Icon icon={'material-symbols:send'} />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    {(orderIsDineIn && lastStatusOrder === OrderStatusEnum.COOKED) ||
                    (orderIsPickup && lastStatusOrder === OrderStatusEnum.COOKED) ||
                    (orderIsTakeaway && lastStatusOrder === OrderStatusEnum.COOKED) ? (
                        <>
                            <DropdownMenuItem className="cursor-pointer" onClick={handleOrderReadyToServe}>
                                Pesanan Siap Disajikan
                                <DropdownMenuShortcut>
                                    <Icon icon={'icon-park-outline:delivery'} />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    ) : null}

                    {(orderIsDineIn || orderIsTakeaway || orderIsPickup) && lastStatusOrder === OrderStatusEnum.READY_TO_SERVE && (
                        <>
                            <DropdownMenuItem className="cursor-pointer" onClick={handleOrderCompleted}>
                                Pesanan Selesai
                                <DropdownMenuShortcut>
                                    <Icon icon={'fluent-mdl2:completed-solid'} />
                                </DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    <Link href={route('cashier.order.showInvoiceCashier', { id: row.original.id })}>
                        <DropdownMenuItem className="cursor-pointer">
                            Lihat Invoice
                            <DropdownMenuShortcut>
                                <Icon icon={'iconamoon:invoice'} />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Dialog kirim pesanan ke chef */}
            <Dialog open={showDialogChef} onOpenChange={setShowDialogChef}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Pesanan Ke Chef!</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-sm">Pastikan data pesanan sudah benar sebelum mengirim ke Chef</DialogDescription>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={() => {
                                handleSendOrderToChef();
                                setShowDialogChef(false);
                            }}
                        >
                            Saya Mengerti & Kirim Pesanan Ke Chef
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Dialog kirim pesanan ke courier */}
            <Dialog open={showDialogCourier} onOpenChange={setShowDialogCourier}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Kirim Pesanan Ke Kurir!</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-sm">Pastikan data pesanan sudah benar sebelum mengirim ke Kurir</DialogDescription>
                    <DialogFooter className="mt-4">
                        <Button
                            onClick={() => {
                                handleSendOrderToCourier();
                                setShowDialogCourier(false);
                            }}
                        >
                            Saya Mengerti & Kirim Pesanan Ke Kurir
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={showDialogPaymentCash} onOpenChange={setShowDialogPaymentCash}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Masukkan Uang yang Diterima</DialogTitle>
                    </DialogHeader>
                    <DialogDescription className="text-sm">
                        Pastikan jumlah uang yang diterima sesuai dengan jumlah total pesanan nya (Total pesanan:{' '}
                        <strong className="text-black italic">{formatCurrency(row?.original?.total_price)}</strong>)
                    </DialogDescription>

                    <div className="mt-4">
                        <Input
                            type="number"
                            placeholder="Masukkan jumlah uang pelanggan"
                            value={cashReceived}
                            onChange={(e) => setCashReceived(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <DialogFooter className="mt-4">
                        <Button onClick={handlePaymentCash} disabled={!cashReceived || isNaN(Number(cashReceived))}>
                            Selesaikan Pesanan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
