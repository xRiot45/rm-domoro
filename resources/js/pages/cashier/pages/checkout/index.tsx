import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentTypeEnum } from '@/enums/payment-type';
import CashierLayout from '@/layouts/cashier/layout';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import OrderTypeSelection from './components/order-type-selection';
import PaymentTypeSelection from './components/payment-type-selection';
import SummaryRow from './components/summary-row';

interface CheckoutPageProps {
    data: Transaction;
}

export default function CheckoutPage({ data }: CheckoutPageProps) {
    const [selectedOrderType, setSelectedOrderType] = useState<OrderTypeEnum | null>(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentTypeEnum | null>(null);
    const [cashReceived, setCashReceived] = useState<number>(0);
    const [tableNumber, setTableNumber] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState<string>('');
    const [customerPhone, setCustomerPhone] = useState<string>('');
    const [customerAddress, setCustomerAddress] = useState<string>('');

    const transactionItems = data?.transaction_items || [];
    const subtotal = transactionItems?.reduce((acc, item) => acc + item?.unit_price * item?.quantity, 0);
    const deliveryFee = selectedOrderType === OrderTypeEnum.DELIVERY ? 100000 : 0;
    const serviceCharge = 50000;
    const discount = 10000;
    const tax = 1000;
    const finalTotal = subtotal + deliveryFee + serviceCharge - discount + tax;

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
                            {transactionItems?.map((item) => (
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
                        <OrderTypeSelection selectedOrderType={selectedOrderType} setSelectedOrderType={setSelectedOrderType} />

                        {/* Metode Pembayaran */}
                        <PaymentTypeSelection selectedPaymentType={selectedPaymentType} setSelectedPaymentType={setSelectedPaymentType} />
                    </div>

                    {/* Total */}
                    <div className="col-span-1 mt-4 lg:mt-13">
                        <Card className="w-full border p-8 shadow-none">
                            <div className="flex justify-between">
                                <h2 className="mb-2 text-lg font-bold">Rincian Pembayaran</h2>
                                <span>
                                    {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </span>
                            </div>

                            <Separator />
                            <div className="space-y-7">
                                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                                {deliveryFee > 0 && <SummaryRow label="Biaya Pengantaran" value={formatCurrency(deliveryFee)} />}
                                <SummaryRow label="Biaya Layanan" value={formatCurrency(serviceCharge)} />
                                <SummaryRow label="Diskon" value={`- ${formatCurrency(discount)}`} className="text-red-500" />
                                <SummaryRow label="Pajak" value={formatCurrency(tax)} />
                                <SummaryRow label="Total Akhir" value={formatCurrency(finalTotal)} isBold />

                                {/* Input Nomor Meja untuk Dine-In */}
                                {selectedOrderType === OrderTypeEnum.DINEIN && (
                                    <div className="flex justify-between">
                                        <span>Nomor Meja</span>
                                        <Input
                                            type="text"
                                            className="w-44 border text-right shadow-none"
                                            value={tableNumber || ''}
                                            placeholder="Nomor Meja"
                                            onChange={(e) => setTableNumber(e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Input Informasi Pengiriman untuk Delivery */}
                                {selectedOrderType === OrderTypeEnum.DELIVERY && (
                                    <div className="block">
                                        <span>Informasi Pengiriman</span>
                                        <div className="mt-3 flex flex-col gap-2">
                                            <Input
                                                type="text"
                                                placeholder="Nama Penerima"
                                                value={customerName}
                                                onChange={(e) => setCustomerName(e.target.value)}
                                                className="rounded-lg px-4 py-6 shadow-none"
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Nomor HP"
                                                value={customerPhone}
                                                onChange={(e) => setCustomerPhone(e.target.value)}
                                                className="rounded-lg px-4 py-6 shadow-none"
                                            />
                                            <Input
                                                type="text"
                                                placeholder="Alamat Pengiriman"
                                                value={customerAddress}
                                                onChange={(e) => setCustomerAddress(e.target.value)}
                                                className="rounded-lg px-4 py-6 shadow-none"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Jika pembayaran adalah Cash, tambahkan input jumlah uang */}
                                {selectedPaymentType === PaymentTypeEnum.CASH && (
                                    <div className="flex justify-between">
                                        <span>Jumlah Uang Diterima</span>
                                        <Input
                                            type="number"
                                            className="w-44 border text-right shadow-none"
                                            value={cashReceived || ''}
                                            placeholder="0"
                                            onChange={(e) => setCashReceived(Number(e.target.value) || 0)}
                                        />
                                    </div>
                                )}

                                {/* Kembalian */}
                                {selectedPaymentType === PaymentTypeEnum.CASH && cashReceived !== null && (
                                    <SummaryRow
                                        label="Kembalian"
                                        value={cashReceived >= finalTotal ? formatCurrency(cashReceived - finalTotal) : formatCurrency(0)}
                                        isBold
                                    />
                                )}
                            </div>

                            {/* Tombol pembayaran */}
                            {selectedPaymentType === PaymentTypeEnum.ONLINE_PAYMENT ? (
                                <Button className="mt-4 py-6 text-sm">
                                    <Icon icon="mdi:credit-card" />
                                    Bayar dengan Midtrans
                                </Button>
                            ) : (
                                <Button className="mt-4 py-6 text-sm">
                                    <Icon icon="mdi:cash" />
                                    Selesaikan Pesanan
                                </Button>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </CashierLayout>
    );
}
