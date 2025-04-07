import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentTypeEnum } from '@/enums/payment-type';
import CashierLayout from '@/layouts/cashier/layout';
import { Chef } from '@/models/chef';
import { Courier } from '@/models/courier';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { formatOrderType } from '@/utils/format-order-type';
import { Icon } from '@iconify/react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

export default function EditPage({ data }: { data: Transaction }) {
    const { chefs } = usePage<{ chefs: Chef[] }>().props;
    const { couriers } = usePage<{ couriers: Courier[] }>().props;

    const {
        data: formData,
        setData,
        processing,
        reset,
    } = useForm({
        chef_id: 0,
        courier_id: 0,
    });

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        router.put(route('cashier.order.update', { id: data?.id }), formData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Pesanan Berhasil Diedit!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
                reset();
            },
            onError: (errors) => {
                toast.error('Failed', {
                    description: 'Pesanan Gagal Diedit!',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
        });
    };

    return (
        <CashierLayout>
            <Head title="Detail Order" />
            <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div>
                    <div className="flex items-center justify-between">
                        <Link href={route('cashier.order.index_cashier')}>
                            <Button variant="default" className="mb-8 cursor-pointer text-sm font-medium">
                                <Icon icon="material-symbols:arrow-back-rounded" />
                                Kembali ke halaman sebelumnya
                            </Button>
                        </Link>
                        <Button variant="default" className="mb-8 cursor-pointer bg-green-600 text-sm font-medium transition-all">
                            <Icon icon="iconamoon:invoice" />
                            Print Invoice
                        </Button>
                    </div>
                    <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Detail Pesanan</h1>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Lihat semua informasi terkait pesanan ini, mulai dari item yang dipesan hingga status pembayaran dan lainnya
                    </p>
                </div>

                {/* Info Transaksi */}
                <div className="grid lg:grid-cols-3 lg:gap-4">
                    {/* Info Umum */}
                    <section className="mt-6 space-y-4 rounded-xl border p-8">
                        <h1 className="mb-6 text-xl font-bold">Info Umum</h1>

                        <p className="capitalize">
                            <strong>Order Number :</strong> {data.order_number}
                        </p>

                        <p className="capitalize">
                            <strong>Metode Pemesanan :</strong> {formatOrderType(data.order_type ?? '')}
                        </p>

                        <p className="capitalize">
                            <strong>Metode Pembayaran :</strong> {data.payment_method}
                        </p>

                        {data.order_type === OrderTypeEnum.DINEIN && (
                            <p className="capitalize">
                                <strong>Nomor Meja :</strong> {data.table_number ?? '-'}
                            </p>
                        )}

                        <p className="capitalize">
                            <strong>Status Pembayaran :</strong> {data.payment_status}
                        </p>

                        <p className="capitalize">
                            <strong>Total Harga :</strong> {formatCurrency(data.total_price)}
                        </p>

                        <p className="capitalize">
                            <strong>Total Akhir :</strong> {formatCurrency(data.final_total)}
                        </p>

                        {data.payment_method === PaymentTypeEnum.CASH && (
                            <>
                                <p className="capitalize">
                                    <strong>Uang Diterima :</strong> {formatCurrency(data.cash_received ?? 0)}
                                </p>
                                <p className="capitalize">
                                    <strong>Kembalian :</strong> {formatCurrency(data.change ?? 0)}
                                </p>
                            </>
                        )}

                        <p className="capitalize">
                            <strong>Waktu Order Dibuat :</strong> {formatDate(data.created_at ?? '-')}
                        </p>

                        <p className="capitalize">
                            <strong>Catatan :</strong> {data.note ?? '-'}
                        </p>

                        <p className="capitalize">
                            <strong>Status Pesanan :</strong>{' '}
                            {data.order_status?.length > 0 ? data.order_status[data.order_status.length - 1].status : '-'}
                        </p>
                    </section>

                    {/* Info Biaya Lainnya */}
                    <section className="mt-6 space-y-4 rounded-xl border p-8">
                        <h1 className="mb-6 text-xl font-bold">Info Biaya Lainnya</h1>

                        {data.order_type === OrderTypeEnum.DELIVERY && (
                            <p className="capitalize">
                                <strong>Biaya Pengiriman :</strong> {formatCurrency(data.delivery_fee ?? 0)}
                            </p>
                        )}

                        <p className="capitalize">
                            <strong>Biaya Layanan :</strong> {formatCurrency(data.service_charge ?? 0)}
                        </p>

                        {data.discount > 0 && (
                            <p className="capitalize">
                                <strong>Diskon :</strong> -{formatCurrency(data.discount)}
                            </p>
                        )}

                        <p className="capitalize">
                            <strong>Pajak :</strong> {formatCurrency(data.tax ?? 0)}
                        </p>
                    </section>

                    {/* Info Penerima */}
                    {[OrderTypeEnum.DELIVERY, OrderTypeEnum.TAKEWAY, OrderTypeEnum.PICKUP].includes(data.order_type ?? OrderTypeEnum.DINEIN) && (
                        <section className="mt-6 space-y-4 rounded-xl border p-8">
                            <h1 className="mb-6 text-xl font-bold">Info Penerima</h1>

                            <p className="capitalize">
                                <strong>Nama Penerima :</strong> {data.recipient ?? '-'}
                            </p>

                            {[OrderTypeEnum.DELIVERY, OrderTypeEnum.PICKUP].includes(data.order_type ?? OrderTypeEnum.DINEIN) && (
                                <p className="capitalize">
                                    <strong>No HP Penerima :</strong> {data.recipient_phone_number ?? '-'}
                                </p>
                            )}

                            {data.order_type === OrderTypeEnum.DELIVERY && (
                                <p className="capitalize">
                                    <strong>Alamat Pengiriman :</strong> {data.shipping_address ?? '-'}
                                </p>
                            )}
                        </section>
                    )}
                </div>

                <Separator className="my-4" />

                {/* Daftar Item */}
                <section>
                    <h1 className="mb-2 text-lg font-bold">Menu Yang Dipesan</h1>
                    <div className="mt-2 space-y-4">
                        {data.transaction_items.map((item) => (
                            <div key={item.id} className="flex items-start gap-6 rounded-xl border p-4">
                                <img src={`${item.menu_item.image_url}`} alt={item.menu_item.name} className="h-20 w-20 rounded-md object-cover" />
                                <div className="space-y-2">
                                    <h3 className="text-lg font-bold">{item.menu_item.name}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-200"> {item.menu_item.menu_category.name}</p>
                                    <p className="text-sm">Harga Satuan: {formatCurrency(item.unit_price)}</p>
                                    <p className="text-sm">Jumlah: {item.quantity}</p>
                                    <p className="text-sm font-semibold">Subtotal: {formatCurrency(item.subtotal)}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <form onSubmit={handleSubmit} className="mt-8">
                    <section className="space-y-4">
                        <div id="chef_id">
                            <Label htmlFor="chef_id">Chef / Koki</Label>
                            <Select onValueChange={(value) => setData('chef_id', parseInt(value))}>
                                <SelectTrigger className="mt-2 w-full">
                                    <SelectValue placeholder="Pilih Chef / Koki" />
                                </SelectTrigger>
                                <SelectContent>
                                    {chefs.map((item) => (
                                        <SelectItem key={item.id} value={String(item.id)}>
                                            {item.user.full_name} - {item.user.phone_number}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {data?.order_type === OrderTypeEnum.DELIVERY && (
                            <div id="courier_id">
                                <Label htmlFor="courier_id">Courier / Kurir</Label>
                                <Select onValueChange={(value) => setData('courier_id', parseInt(value))}>
                                    <SelectTrigger className="mt-2 w-full">
                                        <SelectValue placeholder="Pilih Courier / Kurir" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {couriers.map((item) => (
                                            <SelectItem key={item.id} value={String(item.id)}>
                                                {item.user.full_name} - {item.user.phone_number}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                    </section>

                    <div className="mt-4 flex justify-end space-x-3">
                        <Button type="submit" tabIndex={4} disabled={processing} className="flex cursor-pointer">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Edit Data <Icon icon="material-symbols:edit" />
                        </Button>
                    </div>
                </form>
            </div>
        </CashierLayout>
    );
}
