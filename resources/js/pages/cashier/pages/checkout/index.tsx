import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentTypeEnum } from '@/enums/payment-type';
import CashierLayout from '@/layouts/cashier/layout';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

interface CheckoutPageProps {
    data: Transaction;
}

const iconsOrderType = {
    DINEIN: <Icon icon="mdi:food" width={24} height={24} />,
    TAKEAWAY: <Icon icon="mdi:bag-carry" width={24} height={24} />,
    DELIVERY: <Icon icon="mdi:truck-delivery" width={24} height={24} />,
};

const iconsPaymentType = {
    CASH: <Icon icon="mdi:cash" width={24} height={24} />,
    ONLINE_PAYMENT: <Icon icon="mdi:wallet" width={24} height={24} />,
};

export default function CheckoutPage({ data }: CheckoutPageProps) {
    // const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedOrderType, setSelectedOrderType] = useState<OrderTypeEnum | null>(null);
    const [selectedPaymentType, setSelectedPaymentType] = useState<PaymentTypeEnum | null>(null);
    const transactionItems = data?.transaction_items || [];

    return (
        <CashierLayout>
            <Head title="Checkout" />
            <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4">
                    <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Selesaikan Pesanan</h1>
                    <p className="text-muted-foreground mt-1.5 text-[16px]">Tinjau pesanan Anda dan pilih metode pembayaran</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                    {/* Menu Items */}
                    {/* <Collapsible open={isOpen} onOpenChange={setIsOpen} className="col-span-2 space-y-2">
                        <CollapsibleTrigger className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-gray-50 px-6 py-4 transition-all">
                            <h2 className="text-lg font-medium dark:text-black">Menu Yang Dipesan</h2>
                            {isOpen ? <ChevronUp className="h-5 w-5 dark:text-black" /> : <ChevronDown className="h-5 w-5 dark:text-black" />}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <div className="mt-2 space-y-3">
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
                                                    <p className="text-sm text-gray-500 dark:text-gray-200">Qty: {item.quantity}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-200">
                                                        {formatCurrency(item.unit_price)} / menu
                                                    </p>
                                                </div>
                                                <p className="text-md font-medium">{formatCurrency(item.unit_price * item.quantity)}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CollapsibleContent>
                    </Collapsible> */}
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
                                                <p className="text-sm text-gray-500 dark:text-gray-200">Qty: {item.quantity}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-200">{formatCurrency(item.unit_price)} / menu</p>
                                            </div>
                                            <p className="text-md font-medium">{formatCurrency(item.unit_price * item.quantity)}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Metode Pemesanan */}
                        <div className="mt-2 space-y-3">
                            <h1 className="mb-4 text-lg font-semibold">Metode Pemesanan</h1>
                            <RadioGroup
                                value={selectedOrderType || ''}
                                onValueChange={(value) => setSelectedOrderType(value as OrderTypeEnum)}
                                className="w-full space-y-4 lg:flex"
                            >
                                {Object.entries(OrderTypeEnum).map(([key, value]) => (
                                    <Card
                                        key={key}
                                        className={`flex h-24 w-full cursor-pointer flex-row items-center gap-4 rounded-xl border px-8 py-6 shadow-none transition-colors ${selectedOrderType === value ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-black dark:bg-black dark:text-white'} `}
                                        onClick={() => setSelectedOrderType(value)}
                                    >
                                        <RadioGroupItem
                                            value={value}
                                            id={key}
                                            className={` ${selectedOrderType === value ? 'bg-white dark:bg-black' : 'bg-transparent'}`}
                                        />
                                        {iconsOrderType[key as keyof typeof iconsOrderType]}
                                        <div>
                                            <p className="font-bold">{key.replace('_', ' ')}</p>
                                            <p className="text-sm font-normal capitalize opacity-70">{value}</p>
                                        </div>
                                    </Card>
                                ))}
                            </RadioGroup>
                        </div>

                        {/* Metode Pembayaran */}
                        <div className="mt-2 space-y-3">
                            <h1 className="mb-4 text-lg font-semibold">Metode Pembayaran</h1>
                            <RadioGroup
                                value={selectedPaymentType || ''}
                                onValueChange={(value) => setSelectedPaymentType(value as PaymentTypeEnum)}
                                className="w-full space-y-4 lg:flex"
                            >
                                {Object.entries(PaymentTypeEnum).map(([key, value]) => (
                                    <Card
                                        key={key}
                                        className={`flex h-24 w-full cursor-pointer flex-row items-center gap-4 rounded-xl border px-8 py-6 shadow-none transition-colors ${selectedPaymentType === value ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-white text-black dark:bg-black dark:text-white'} `}
                                        onClick={() => setSelectedPaymentType(value)}
                                    >
                                        <RadioGroupItem
                                            value={value}
                                            id={key}
                                            className={`${selectedPaymentType === value ? 'bg-white dark:bg-black' : 'bg-transparent'}`}
                                        />
                                        {iconsPaymentType[key as keyof typeof iconsPaymentType]}
                                        <div>
                                            <p className="font-bold">{key.replace('_', ' ')}</p>
                                            <p className="text-sm font-normal capitalize opacity-70">{value}</p>
                                        </div>
                                    </Card>
                                ))}
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="col-span-1"></div>
                </div>
            </div>
        </CashierLayout>
    );
}
