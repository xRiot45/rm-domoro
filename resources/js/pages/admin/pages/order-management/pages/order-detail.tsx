import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/admin/layout';
import { Transaction } from '@/models/transaction';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import OrderProgress from './components/order-progress';

interface OrderDetailPageProps {
    transaction: Transaction;
}

export default function OrderDetailPage({ transaction }: OrderDetailPageProps) {
    const {
        order_number,
        order_type,
        payment_method,
        payment_status,
        table_number,
        shipping_address,
        recipient,
        recipient_phone_number,
        note,
        total_price,
        delivery_fee,
        service_charge,
        discount,
        tax,
        final_total,
        checked_out_at,
        order_status,
        transaction_items,
        customer,
        cashier,
        courier,
    } = transaction;

    return (
        <AdminLayout>
            <Head title="Detail Order" />
            <div className="space-y-4 p-4">
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
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Nomor Order:</strong> {order_number}
                        </div>
                        <div>
                            <strong>Jenis Order:</strong> {order_type}
                        </div>
                        <div>
                            <strong>Metode Pembayaran:</strong> {payment_method}
                        </div>
                        <div>
                            <strong>Status Pembayaran:</strong> {payment_status}
                        </div>
                        <div>
                            <strong>Nomor Meja:</strong> {table_number ?? '-'}
                        </div>
                        <div>
                            <strong>Alamat Pengiriman:</strong> {shipping_address ?? '-'}
                        </div>
                        <div>
                            <strong>Penerima:</strong> {recipient ?? '-'}
                        </div>
                        <div>
                            <strong>No. Telp Penerima:</strong> {recipient_phone_number ?? '-'}
                        </div>
                        <div>
                            <strong>Catatan:</strong> {note ?? '-'}
                        </div>
                        <div>
                            <strong>Waktu Checkout:</strong> {checked_out_at ? new Date(checked_out_at).toLocaleString() : '-'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Customer</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Nama:</strong> {customer?.user?.full_name ?? '-'}
                        </div>
                        <div>
                            <strong>Email:</strong> {customer?.user?.email ?? '-'}
                        </div>
                        <div>
                            <strong>No. Telp:</strong> {customer?.user?.phone_number ?? '-'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kasir</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Nama:</strong> {cashier?.user?.full_name ?? '-'}
                        </div>
                        <div>
                            <strong>Email:</strong> {cashier?.user?.email ?? '-'}
                        </div>
                        <div>
                            <strong>No. Telp:</strong> {cashier?.user?.phone_number ?? '-'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Kurir</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Nama:</strong> {courier?.user?.full_name ?? '-'}
                        </div>
                        <div>
                            <strong>Email:</strong> {courier?.user?.email ?? '-'}
                        </div>
                        <div>
                            <strong>No. Telp:</strong> {courier?.user?.phone_number ?? '-'}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Detail Menu</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {transaction_items.map((item) => (
                            <div key={item.id} className="rounded border p-4">
                                <div className="flex items-center gap-4">
                                    <img src={`${item.menu_item.image_url}`} alt={item.menu_item.name} className="h-20 w-20 rounded object-cover" />
                                    <div>
                                        <h2 className="text-lg font-semibold">{item.menu_item.name}</h2>
                                        <div className="text-muted-foreground text-sm">Kategori: {item.menu_item.menu_category.name}</div>
                                        <div className="text-sm">Harga: Rp{item.unit_price.toLocaleString()}</div>
                                        <div className="text-sm">Jumlah: {item.quantity}</div>
                                        <div className="text-sm font-semibold">Subtotal: Rp{item.subtotal.toLocaleString()}</div>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm">Bahan: {item.menu_item.ingredients.join(', ')}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Pembayaran</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <strong>Total Harga:</strong> Rp{total_price.toLocaleString()}
                        </div>
                        <div>
                            <strong>Biaya Pengiriman:</strong> Rp{delivery_fee.toLocaleString()}
                        </div>
                        <div>
                            <strong>Biaya Layanan:</strong> Rp{service_charge.toLocaleString()}
                        </div>
                        <div>
                            <strong>Diskon:</strong> Rp{discount.toLocaleString()}
                        </div>
                        <div>
                            <strong>Pajak:</strong> Rp{tax.toLocaleString()}
                        </div>
                        <div className="text-primary text-lg font-semibold">
                            <strong>Total Akhir:</strong> Rp{final_total.toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
