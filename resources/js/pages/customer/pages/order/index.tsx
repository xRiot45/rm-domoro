import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusEnum } from '@/enums/order-status';
import { PaymentStatusEnum } from '@/enums/payment-status';
import AppLayout from '@/layouts/app/layout';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { orderStatusMap } from '@/utils/order-status-map';
import { paymentStatusMap } from '@/utils/payment-status-map';
import { Head, Link } from '@inertiajs/react';

interface OrderPageProps {
    myOrders: Transaction[];
}

export default function OrderPage({ myOrders }: OrderPageProps) {
    return (
        <>
            <AppLayout>
                <Head title="Order" />
                <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl py-4">
                    <div className="mb-4">
                        <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Pesanan Saya</h1>
                        <p className="text-muted-foreground mt-1.5 text-[16px]">Lihat status dan detail pesanan Anda di sini.</p>
                    </div>

                    <div className="w-full overflow-x-auto">
                        <Table className="min-w-[800px]">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px]">Nomor Pesanan</TableHead>
                                    <TableHead className="min-w-[200px]">Menu</TableHead>
                                    <TableHead className="min-w-[50px] text-center">Kuantitas</TableHead>
                                    <TableHead>Status Pembayaran</TableHead>
                                    <TableHead>Status Pesanan</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead className="min-w-[140px]">Tanggal Pemesanan</TableHead>
                                    <TableHead>Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {myOrders.length > 0 ? (
                                    myOrders.map((order) => {
                                        const latestStatus = order.order_status?.[order.order_status.length - 1]?.status ?? '-';

                                        return (
                                            <TableRow key={order.id}>
                                                {/* Order Number Cell */}
                                                <TableCell>{order?.order_number ?? '-'}</TableCell>

                                                {/* Menu Cell */}
                                                <TableCell>
                                                    <div className="flex items-start gap-3">
                                                        {order.transaction_items[0]?.menu_item?.image_url && (
                                                            <img
                                                                src={`${order.transaction_items[0].menu_item.image_url}`}
                                                                alt={order.transaction_items[0].menu_item?.name}
                                                                className="h-16 w-16 rounded-md object-cover"
                                                            />
                                                        )}
                                                        <div className="flex flex-col justify-center">
                                                            <h1 className="font-bold">{order.transaction_items[0]?.menu_item?.name ?? '-'}</h1>
                                                            <span className="text-muted-foreground text-sm">
                                                                {order.transaction_items[0]?.menu_item?.menu_category?.name ?? '-'}
                                                            </span>
                                                            {order.transaction_items.length > 1 && (
                                                                <span className="text-muted-foreground mt-1 text-xs">
                                                                    dan {order.transaction_items.length - 1} menu lainnya
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </TableCell>

                                                {/* Qty Cell */}
                                                <TableCell className="text-center align-top">
                                                    <span className="font-medium">{order.transaction_items[0]?.quantity ?? 0}x</span>
                                                    {order.transaction_items.length > 1 && (
                                                        <div className="text-muted-foreground mt-1 text-xs">
                                                            +{order.transaction_items.length - 1} item
                                                        </div>
                                                    )}
                                                </TableCell>

                                                {/* Status Pembayaran Cell*/}
                                                <TableCell>
                                                    <Badge className={paymentStatusMap[order.payment_status as PaymentStatusEnum]?.className}>
                                                        {paymentStatusMap[order.payment_status as PaymentStatusEnum]?.label ?? order.payment_status}
                                                    </Badge>
                                                </TableCell>

                                                {/* Status Pesanan Cell */}
                                                <TableCell>
                                                    <Badge className={orderStatusMap[latestStatus as OrderStatusEnum]?.className}>
                                                        {orderStatusMap[latestStatus as OrderStatusEnum]?.label ?? latestStatus}
                                                    </Badge>
                                                </TableCell>

                                                {/* Total Akhir Cell */}
                                                <TableCell>{formatCurrency(order?.final_total ?? 0)}</TableCell>

                                                {/* Tanggal Pemesanan Cell */}
                                                <TableCell>{formatDate(order?.created_at ?? '-')}</TableCell>
                                                <TableCell>
                                                    <Link href={route('order.show', { id: order.id })}>
                                                        <Button variant="outline" size="sm">
                                                            Lihat Detail Pesanan
                                                        </Button>
                                                    </Link>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center">
                                            Belum ada pesanan.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
