import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentStatusEnum } from '@/enums/payment-status';
import { PaymentTypeEnum } from '@/enums/payment-type';
import AdminLayout from '@/layouts/admin/layout';
import { Transaction } from '@/models/transaction';
import { BreadcrumbItem } from '@/types';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { paymentStatusMap } from '@/utils/payment-status-map';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import OrderProgress from './components/order-progress';

interface OrderDetailPageProps {
    transaction: Transaction;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manajemen Order / Pesanan',
        href: '#',
    },
    {
        title: 'Detail Order',
        href: '#',
    },
];

export default function OrderDetailPage({ transaction }: OrderDetailPageProps) {
    const {
        order_number,
        order_status,
        order_type,
        payment_method,
        payment_status,
        table_number,
        shipping_address,
        recipient,
        recipient_phone_number,
        note,
        checked_out_at,
        customer,
        customer_id,
        cashier,
        courier,
        chef,
        transaction_items,
        total_price,
        delivery_fee,
        service_charge,
        discount,
        tax,
        final_total,
        cash_received,
        change,
    } = transaction;

    const isDineIn = order_type === OrderTypeEnum.DINEIN;
    const isDelivery = order_type === OrderTypeEnum.DELIVERY;
    const isCash = payment_method === PaymentTypeEnum.CASH;
    const isSelfOrder = customer_id;
    const isTakeway = order_type === OrderTypeEnum.TAKEWAY;
    const isPickup = order_type === OrderTypeEnum.PICKUP;

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Order" />
            <div className="container mx-auto space-y-4 p-4">
                <Button className="w-full cursor-pointer md:w-fit" variant="default" onClick={() => window.history.back()}>
                    <Icon icon="mdi:arrow-left" className="mr-2 h-4 w-4" />
                    Kembali ke halaman sebelumnya
                </Button>

                {/* Order Progress */}
                <OrderProgress orderId={order_number} orderStatus={order_status} />

                {/* Informasi Umum */}
                <Card className="rounded-2xl px-4 py-8 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl">Informasi Umum</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 capitalize md:grid-cols-2">
                        <div>
                            <strong>Nomor Pesanan :</strong> {order_number}
                        </div>
                        <div>
                            <strong>Metode Pemesanan :</strong> {order_type}
                        </div>
                        <div>
                            <strong>Metode Pembayaran :</strong> {payment_method}
                        </div>
                        <div>
                            <strong>Status Pembayaran :</strong>{' '}
                            <Badge variant="default" className={paymentStatusMap[payment_status as PaymentStatusEnum]?.className}>
                                {paymentStatusMap[payment_status as PaymentStatusEnum]?.label ?? payment_status}
                            </Badge>
                        </div>

                        {isDineIn && (
                            <div>
                                <strong>Nomor Meja :</strong> {table_number ?? '-'}
                            </div>
                        )}

                        {isTakeway && (
                            <div>
                                <strong>Nama Penerima :</strong> {recipient ?? '-'}
                            </div>
                        )}

                        {isPickup && (
                            <>
                                <div>
                                    <strong>Nama Penerima :</strong> {recipient ?? '-'}
                                </div>
                                <div>
                                    <strong>Nomor Penerima :</strong> {recipient_phone_number ?? '-'}
                                </div>
                            </>
                        )}

                        <div>
                            <strong>Catatan :</strong> {note ?? '-'}
                        </div>
                        <div>
                            <strong>Tanggal & Waktu Checkout Pesanan :</strong> {formatDate(checked_out_at ?? '-')}
                        </div>
                    </CardContent>
                </Card>

                {/* Informasi Customer (Jika pesanan dibuat oleh customer) */}
                {isSelfOrder && (
                    <Card className="rounded-2xl px-4 py-8 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-2xl">Informasi Customer</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <strong>Nama Lengkap:</strong> {customer?.user?.full_name ?? '-'}
                            </div>
                            <div>
                                <strong>Email :</strong> {customer?.user?.email ?? '-'}
                            </div>
                            <div>
                                <strong>No. Telp :</strong> {customer?.user?.phone_number ?? '-'}
                            </div>
                            <div>
                                <strong>Label Alamat :</strong> {customer?.address_label ?? '-'}
                            </div>
                            <div>
                                <strong>Alamat Lengkap :</strong> {customer?.address ?? '-'}
                            </div>
                            <div>
                                <strong>Catatan Untuk Kurir :</strong> {customer?.note ?? '-'}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Informasi Delivery */}
                {isDelivery && !isSelfOrder && (
                    <Card className="rounded-2xl px-4 py-8 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl">Informasi Delivery / Pengiriman</CardTitle>
                        </CardHeader>
                        <CardContent className="text-md grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <strong>Alamat Pengiriman :</strong> {shipping_address ?? '-'}
                            </div>
                            <div>
                                <strong>Penerima :</strong> {recipient ?? '-'}
                            </div>
                            <div>
                                <strong>No. Telp Penerima :</strong> {recipient_phone_number ?? '-'}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Informasi Kasir */}
                <Card className="rounded-2xl px-4 py-8 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl">Informasi Kasir</CardTitle>
                    </CardHeader>
                    <CardContent className="text-md grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Nama :</strong> {cashier?.user?.full_name ?? '-'}
                        </div>
                        <div>
                            <strong>Email :</strong> {cashier?.user?.email ?? '-'}
                        </div>
                        <div>
                            <strong>No. Telp :</strong> {cashier?.user?.phone_number ?? '-'}
                        </div>
                    </CardContent>
                </Card>

                {/* Informasi Chef */}
                <Card className="rounded-2xl px-4 py-8 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl">Informasi Chef / Koki</CardTitle>
                    </CardHeader>
                    <CardContent className="text-md grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Nama :</strong> {chef?.user?.full_name ?? '-'}
                        </div>
                        <div>
                            <strong>Email :</strong> {chef?.user?.email ?? '-'}
                        </div>
                        <div>
                            <strong>No. Telp :</strong> {chef?.user?.phone_number ?? '-'}
                        </div>
                    </CardContent>
                </Card>

                {/* Informasi Kurir */}
                {isDelivery && (
                    <Card className="rounded-2xl px-4 py-8 shadow-none">
                        <CardHeader>
                            <CardTitle className="text-xl">Informasi Kurir</CardTitle>
                        </CardHeader>
                        <CardContent className="text-md grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <strong>Nama :</strong> {courier?.user?.full_name ?? '-'}
                            </div>
                            <div>
                                <strong>Email :</strong> {courier?.user?.email ?? '-'}
                            </div>
                            <div>
                                <strong>No. Telp :</strong> {courier?.user?.phone_number ?? '-'}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Daftar Menu */}
                <Card className="rounded-2xl px-4 py-8 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl">Menu Pesanan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {transaction_items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div className="flex items-start gap-4">
                                    <img
                                        src={`${item.menu_item.image_url}`}
                                        alt={item.menu_item.name}
                                        className="h-24 w-24 rounded-lg object-cover"
                                    />
                                    <div className="space-y-2">
                                        <h2 className="text-md font-bold">{item.menu_item.name}</h2>
                                        <h2 className="text-muted-foreground text-sm">{item.menu_item.menu_category.name}</h2>
                                        <h2 className="text-sm">Jumlah : {item.quantity} Pesanan</h2>
                                        <h2 className="text-sm">Harga Per Menu : {formatCurrency(item?.unit_price ?? 0)}</h2>

                                        <p className="text-sm font-semibold">Subtotal : {formatCurrency(item.subtotal)}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Ringkasan Pembayaran */}
                <Card className="rounded-2xl px-4 py-8 shadow-none">
                    <CardHeader>
                        <CardTitle className="text-xl">Ringkasan Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between">
                                <span className="font-bold">Total Harga</span>
                                <span>{formatCurrency(total_price)}</span>
                            </div>
                            {isDelivery && (
                                <div className="flex justify-between">
                                    <span className="font-bold">Biaya Pengiriman</span>
                                    <span>{formatCurrency(delivery_fee)}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="font-bold">Biaya Layanan</span>
                                <span>{formatCurrency(service_charge ?? 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Diskon</span>
                                <span className="text-red-500">-{formatCurrency(discount ?? 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-bold">Pajak</span>
                                <span>{formatCurrency(tax ?? 0)}</span>
                            </div>

                            {isCash && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="font-bold">Uang Yang Diterima</span>
                                        <span>{formatCurrency(cash_received ?? 0)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-bold">Kembalian</span>
                                        <span>{formatCurrency(change ?? 0)}</span>
                                    </div>
                                </>
                            )}

                            <Separator className="my-4" />
                            <div className="flex justify-between font-bold">
                                <span className="font-bold">Total Akhir</span>
                                <span>{formatCurrency(final_total)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
