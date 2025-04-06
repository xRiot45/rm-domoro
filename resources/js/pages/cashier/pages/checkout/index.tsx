import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentTypeEnum } from '@/enums/payment-type';
import CashierLayout from '@/layouts/cashier/layout';
import { Fee } from '@/models/fee';
import { Transaction, TransactionForm } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import OrderTypeSelection from './components/order-type-selection';
import PaymentTypeSelection from './components/payment-type-selection';
import SummaryRow from './components/summary-row';

interface CheckoutPageProps {
    data: Transaction;
    fees: Fee;
}

export default function CheckoutPage({ data, fees }: CheckoutPageProps) {
    const { flash } = usePage().props as unknown as { flash: { snap_token: string } };
    const { id: transactionId, transaction_items } = data;
    const {
        data: formData,
        setData,
        processing,
    } = useForm<Required<TransactionForm>>({
        transaction_id: transactionId,
        order_type: OrderTypeEnum.DINEIN,
        payment_method: PaymentTypeEnum.CASH,
        cash_received: 0,
        table_number: '',
        recipient: '',
        recipient_phone_number: '',
        shipping_address: '',
        note: '',
    });

    const subtotal = transaction_items?.reduce((acc, item) => acc + item?.unit_price * item?.quantity, 0);
    const deliveryFee = formData?.order_type === OrderTypeEnum.DELIVERY ? fees?.delivery?.amount : 0;
    const serviceCharge = fees?.service?.amount;
    const discount = fees?.discount?.amount;
    const tax = fees?.tax?.amount;
    const finalTotal = subtotal + deliveryFee + serviceCharge - discount + tax;

    const handleOrderTypeChange = (orderType: OrderTypeEnum) => {
        setData('order_type', orderType);

        if (orderType !== OrderTypeEnum.DINEIN) {
            setData('table_number', '');
        }
        if (orderType !== OrderTypeEnum.DELIVERY) {
            setData('shipping_address', '');
            setData('recipient', '');
            setData('recipient_phone_number', '');
        }
    };

    const handlePaymentTypeChange = (paymentType: PaymentTypeEnum) => {
        setData('payment_method', paymentType);
        if (paymentType !== PaymentTypeEnum.CASH) {
            setData('cash_received', 0);
        }
    };

    const handlePayWithCash = () => {
        if (formData.order_type === OrderTypeEnum.DINEIN && (!formData.table_number.trim() || !formData.cash_received)) {
            toast.error('Gagal', {
                description: 'Nomor meja dan jumlah uang yang diterima harus diisi untuk pemesanan Dine In.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        if (formData.order_type === OrderTypeEnum.TAKEWAY && (!formData.recipient.trim() || !formData.cash_received)) {
            toast.error('Gagal', {
                description: 'Nama penerima dan jumlah uang yang diterima harus diisi untuk pemesanan Takeway.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        if (
            formData.order_type === OrderTypeEnum.DELIVERY &&
            (!formData.shipping_address.trim() || !formData.recipient.trim() || !formData.recipient_phone_number.trim() || !formData.cash_received)
        ) {
            toast.error('Gagal', {
                description:
                    'Alamat pengiriman, nama penerima, nomor telepon penerima dan jumlah uang yang diterima harus diisi untuk pemesanan Delivery.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        if (
            formData.order_type === OrderTypeEnum.PICKUP &&
            (!formData.recipient.trim() || !formData.recipient_phone_number.trim() || !formData.cash_received)
        ) {
            toast.error('Gagal', {
                description: 'Nama penerima, nomor telepon penerima dan jumlah uang yang diterima harus diisi untuk pemesanan Pickup.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        router.put(route('cashier.checkout.pay-cash', { transaction: transactionId }), formData, {
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Transaksi Berhasil',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
            onError: (errors) => {
                Object.entries(errors).forEach(([_, message]) => {
                    if (typeof message === 'string') {
                        toast.error('Failed', {
                            description: message,
                            action: {
                                label: 'Tutup',
                                onClick: () => toast.dismiss(),
                            },
                        });
                    }
                });
            },
        });
    };

    // Tampilkan metode pembayaran midtrans nya
    useEffect(() => {
        if (flash?.snap_token) {
            window.snap.pay(flash.snap_token);
        }
    }, [flash?.snap_token]);

    const handlePayWithMidtrans = () => {
        if (formData.order_type === OrderTypeEnum.DINEIN && !formData.table_number.trim()) {
            toast.error('Gagal', {
                description: 'Nomor meja harus diisi untuk pemesanan Dine In.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        if (formData.order_type === OrderTypeEnum.TAKEWAY && !formData.recipient.trim()) {
            toast.error('Gagal', {
                description: 'Nama penerima harus diisi untuk pemesanan Takeway.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        if (
            formData.order_type === OrderTypeEnum.DELIVERY &&
            (!formData.shipping_address.trim() || !formData.recipient.trim() || !formData.recipient_phone_number.trim())
        ) {
            toast.error('Gagal', {
                description: 'Alamat pengiriman, nama penerima, dan nomor telepon penerima harus diisi untuk pemesanan Delivery.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        if (formData.order_type === OrderTypeEnum.PICKUP && (!formData.recipient.trim() || !formData.recipient_phone_number.trim())) {
            toast.error('Gagal', {
                description: 'Nama penerima dan nomor telepon penerima harus diisi untuk pemesanan Pickup.',
                action: {
                    label: 'Tutup',
                    onClick: () => toast.dismiss(),
                },
            });
            return;
        }

        router.post(route('cashier.transaction.pay-midtrans', { transaction: transactionId }), formData, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Success', {
                    description: 'Silahkan melakukan pembayaran melalui midtrans',
                    action: {
                        label: 'Tutup',
                        onClick: () => toast.dismiss(),
                    },
                });
            },
            onError: (errors) => {
                Object.entries(errors).forEach(([_, message]) => {
                    if (typeof message === 'string') {
                        toast.error('Gagal', {
                            description: message,
                            action: {
                                label: 'Tutup',
                                onClick: () => toast.dismiss(),
                            },
                        });
                    }
                });
            },
        });
    };

    return (
        <CashierLayout>
            <Head title="Checkout" />
            <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Selesaikan Pesanan</h1>
                    <p className="text-muted-foreground mt-1.5 text-[16px]">Tinjau pesanan Anda dan pilih metode pembayaran</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6">
                    <div className="col-span-2 space-y-8">
                        {/* Menu Yang Dipesan */}
                        <div className="mt-2 space-y-3">
                            <h1 className="mb-4 text-lg font-semibold">Menu Yang Dipesan</h1>
                            {transaction_items?.map((item) => (
                                <Card key={item.id} className="px-2 shadow-none">
                                    <CardContent className="flex items-center gap-4 p-4">
                                        <img
                                            src={`${item.menu_item?.image_url}`}
                                            alt={item.menu_item?.name}
                                            className="h-24 w-24 rounded-lg border object-cover"
                                        />
                                        <div className="flex w-full items-center justify-between">
                                            <div className="space-y-1">
                                                <h3 className="text-lg font-semibold">{item.menu_item?.name}</h3>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-200">Qty: {item.quantity}</p>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-200">
                                                    {formatCurrency(item.unit_price)} / Menu
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm">{item.menu_item?.menu_category?.name}</span>
                                                <p className="text-md mt-1 font-medium">{formatCurrency(item.unit_price * item.quantity)}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Metode Pemesanan */}
                        <OrderTypeSelection selectedOrderType={formData.order_type} setSelectedOrderType={handleOrderTypeChange} />

                        {/* Metode Pembayaran */}
                        <PaymentTypeSelection selectedPaymentType={formData.payment_method} setSelectedPaymentType={handlePaymentTypeChange} />
                    </div>

                    {/* Total */}
                    <div className="col-span-1 mt-4 lg:mt-13">
                        <Card className="w-full border p-8 shadow-none">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="mb-1 text-lg font-bold">Rincian Pembayaran</h1>
                                    <span>
                                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                    </span>
                                </div>
                                <span className="text-sm font-semibold">{data?.order_number}</span>
                            </div>

                            <Separator />
                            <div className="space-y-7">
                                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                                {formData.order_type === OrderTypeEnum.DELIVERY && (
                                    <SummaryRow label="Biaya Pengiriman" value={formatCurrency(deliveryFee)} />
                                )}
                                <SummaryRow label="Biaya Layanan" value={formatCurrency(serviceCharge)} />
                                <SummaryRow label="Diskon" value={`- ${formatCurrency(discount)}`} className="text-red-500" />
                                <SummaryRow label="Pajak" value={formatCurrency(tax)} />
                                <SummaryRow label="Total Akhir" value={formatCurrency(finalTotal)} isBold />

                                {/* Input Nomor Meja untuk Dine-In */}
                                {formData.order_type === OrderTypeEnum.DINEIN &&
                                    (formData.payment_method === PaymentTypeEnum.CASH ||
                                        formData.payment_method === PaymentTypeEnum.ONLINE_PAYMENT) && (
                                        <div className="flex justify-between">
                                            <span>Nomor Meja</span>
                                            <Input
                                                placeholder="Nomor Meja"
                                                value={formData.table_number}
                                                onChange={(e) => setData('table_number', e.target.value)}
                                                className="w-44 border text-right shadow-none"
                                            />
                                        </div>
                                    )}

                                {/* Input Informasi Pengiriman untuk Delivery */}
                                {[OrderTypeEnum.DELIVERY, OrderTypeEnum.TAKEWAY, OrderTypeEnum.PICKUP].includes(formData.order_type) && (
                                    <div className="block">
                                        <span>Informasi Penerima</span>
                                        <div className="mt-3 flex flex-col gap-2">
                                            <Input
                                                placeholder="Nama Penerima"
                                                value={formData.recipient}
                                                onChange={(e) => setData('recipient', e.target.value)}
                                                className="rounded-lg px-4 py-6 shadow-none"
                                            />

                                            {(formData.order_type === OrderTypeEnum.DELIVERY || formData.order_type === OrderTypeEnum.PICKUP) && (
                                                <Input
                                                    placeholder="Nomor HP"
                                                    value={formData.recipient_phone_number}
                                                    onChange={(e) => setData('recipient_phone_number', e.target.value)}
                                                    className="rounded-lg px-4 py-6 shadow-none"
                                                />
                                            )}

                                            {formData.order_type === OrderTypeEnum.DELIVERY && (
                                                <Input
                                                    placeholder="Alamat Pengiriman"
                                                    value={formData.shipping_address}
                                                    onChange={(e) => setData('shipping_address', e.target.value)}
                                                    className="rounded-lg px-4 py-6 shadow-none"
                                                />
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Jika pembayaran adalah Cash, tambahkan input jumlah uang */}
                                {formData.payment_method === PaymentTypeEnum.CASH && (
                                    <div className="flex justify-between">
                                        <span>Jumlah Uang Diterima</span>
                                        <Input
                                            type="number"
                                            className="w-44 border text-right shadow-none"
                                            value={formData.cash_received || ''}
                                            placeholder="0"
                                            onChange={(e) => setData('cash_received', e.target.value ? Number(e.target.value) : 0)}
                                        />
                                    </div>
                                )}

                                {/* Kembalian */}
                                {formData.payment_method === PaymentTypeEnum.CASH && formData.cash_received !== null && (
                                    <SummaryRow
                                        label="Kembalian"
                                        value={
                                            formData.cash_received >= finalTotal
                                                ? formatCurrency(formData.cash_received - finalTotal)
                                                : formatCurrency(0)
                                        }
                                        isBold
                                    />
                                )}

                                {/* Note */}
                                <Textarea
                                    className="mt-4 h-28"
                                    placeholder="Tambahkan catatan (Optional)"
                                    onChange={(e) => setData('note', e.target.value)}
                                    value={formData.note}
                                />
                            </div>

                            {/* Tombol pembayaran */}
                            {formData.payment_method === PaymentTypeEnum.ONLINE_PAYMENT ? (
                                <Button type="button" className="mt-4 w-full py-6 text-sm" onClick={handlePayWithMidtrans} disabled={processing}>
                                    <Icon icon="mdi:credit-card" />
                                    Bayar dengan Midtrans
                                </Button>
                            ) : (
                                <Button type="submit" className="mt-4 w-full py-6 text-sm" disabled={processing} onClick={handlePayWithCash}>
                                    <Icon icon="mdi:cash" />
                                    Bayar dengan Cash / Tunai
                                </Button>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </CashierLayout>
    );
}
