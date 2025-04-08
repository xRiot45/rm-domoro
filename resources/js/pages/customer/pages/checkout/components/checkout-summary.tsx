import SummaryRow from '@/components/summary-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentTypeEnum } from '@/enums/payment-type';
import { TransactionForm } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { Icon } from '@iconify/react';

interface CheckoutSummaryProps {
    formData: Required<TransactionForm>;
    setData: <K extends keyof TransactionForm>(key: K, value: TransactionForm[K]) => void;
    subtotal: number;
    deliveryFee: number;
    serviceCharge: number;
    discount: number;
    tax: number;
    finalTotal: number;
    orderNumber: string;
    handlePayWithCash: () => void;
    handlePayWithMidtrans: () => void;
    processing: boolean;
}

const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
    formData,
    setData,
    subtotal,
    deliveryFee,
    serviceCharge,
    discount,
    tax,
    finalTotal,
    orderNumber,
    handlePayWithCash,
    handlePayWithMidtrans,
    processing,
}) => {
    return (
        <Card className="mt-4 w-full border p-8 shadow-none lg:mt-13">
            <div className="flex items-center justify-between">
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <h1 className="text-md mb-1 font-bold">Rincian Pembayaran</h1>
                        <span className="text-sm">
                            {new Date().toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </span>
                    </div>
                    <span className="text-sm font-semibold">{orderNumber}</span>
                </div>
            </div>

            <Separator />
            <div className="space-y-7">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                {formData.order_type === OrderTypeEnum.DELIVERY && <SummaryRow label="Biaya Pengiriman" value={formatCurrency(deliveryFee)} />}
                <SummaryRow label="Biaya Layanan" value={formatCurrency(serviceCharge)} />
                <SummaryRow label="Diskon" value={`- ${formatCurrency(discount)}`} className="text-red-500" />
                <SummaryRow label="Pajak" value={formatCurrency(tax)} />
                <SummaryRow label="Total Akhir" value={formatCurrency(finalTotal)} isBold />

                <Textarea
                    className="mt-4 h-28"
                    placeholder="Tambahkan catatan (Optional)"
                    onChange={(e) => setData('note', e.target.value)}
                    value={formData.note}
                />
                {formData.payment_method === PaymentTypeEnum.CASH && (
                    <p className="mt-2 text-sm font-semibold text-red-500 italic">
                        *Jika Anda memilih pembayaran tunai, pastikan untuk menyiapkan uang pas sesuai total akhir.
                    </p>
                )}

                <Button
                    type={formData.payment_method === PaymentTypeEnum.CASH ? 'submit' : 'button'}
                    className="mt-4 w-full py-6 text-sm"
                    disabled={processing}
                    onClick={formData.payment_method === PaymentTypeEnum.CASH ? handlePayWithCash : handlePayWithMidtrans}
                >
                    <Icon icon={formData.payment_method === PaymentTypeEnum.CASH ? 'mdi:cash' : 'mdi:credit-card'} />
                    {formData.payment_method === PaymentTypeEnum.CASH ? 'Bayar dengan Cash / Tunai' : 'Bayar dengan Midtrans'}
                </Button>
            </div>
        </Card>
    );
};

export default CheckoutSummary;
