import showErrorToast from '@/components/error-toast';
import { Card, CardContent } from '@/components/ui/card';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentTypeEnum } from '@/enums/payment-type';
import CashierLayout from '@/layouts/cashier/layout';
import { Fee } from '@/models/fee';
import { Transaction, TransactionForm } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import CheckoutSummary from './components/checkout-summary';
import OrderTypeSelection from './components/order-type-selection';
import PaymentTypeSelection from './components/payment-type-selection';
import validateFormCash from './validation/validate-cash';
import validateFormMidtrans from './validation/validate-midtrans';

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
        if (orderType !== OrderTypeEnum.DINEIN) setData('table_number', '');
        if (orderType !== OrderTypeEnum.DELIVERY) {
            setData('shipping_address', '');
            setData('recipient', '');
            setData('recipient_phone_number', '');
        }
    };

    const handlePaymentTypeChange = (paymentType: PaymentTypeEnum) => {
        setData('payment_method', paymentType);
        if (paymentType !== PaymentTypeEnum.CASH) setData('cash_received', 0);
    };

    const handlePayWithCash = () => {
        if (!validateFormCash({ formData })) return;

        router.put(route('cashier.transaction.pay-cash', { transaction: transactionId }), formData, {
            onSuccess: () =>
                toast.success('Success', {
                    description: 'Transaksi Berhasil',
                    action: { label: 'Tutup', onClick: () => toast.dismiss() },
                }),
            onError: (errors) => {
                Object.entries(errors).forEach(([_, message]) => {
                    if (typeof message === 'string') showErrorToast(message);
                });
            },
        });
    };

    const handlePayWithMidtrans = () => {
        if (!validateFormMidtrans({ formData })) return;

        router.post(route('cashier.transaction.pay-midtrans', { transaction: transactionId }), formData, {
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Success', {
                    description: 'Silahkan melakukan pembayaran melalui midtrans',
                    action: { label: 'Tutup', onClick: () => toast.dismiss() },
                }),
            onError: (errors) => {
                Object.entries(errors).forEach(([_, message]) => {
                    if (typeof message === 'string') showErrorToast(message);
                });
            },
        });
    };

    useEffect(() => {
        if (flash?.snap_token) {
            window.snap.pay(flash.snap_token);
        }
    }, [flash?.snap_token]);

    return (
        <CashierLayout>
            <Head title="Checkout" />
            <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Selesaikan Pesanan</h1>
                    <p className="text-muted-foreground mt-1.5 text-[16px]">Tinjau pesanan Anda dan pilih metode pembayaran</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-4">
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
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-200">Jumlah : {item.quantity}</p>
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

                    {/* Checkout Summary */}
                    <CheckoutSummary
                        formData={formData}
                        setData={setData}
                        subtotal={subtotal}
                        deliveryFee={deliveryFee}
                        serviceCharge={serviceCharge}
                        discount={discount}
                        tax={tax}
                        finalTotal={finalTotal}
                        orderNumber={data?.order_number}
                        handlePayWithCash={handlePayWithCash}
                        handlePayWithMidtrans={handlePayWithMidtrans}
                        processing={processing}
                    />
                </div>
            </div>
        </CashierLayout>
    );
}
