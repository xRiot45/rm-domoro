import SummaryRow from '@/components/summary-row';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
        <Card className="mt-13 w-full border p-8 shadow-none">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="mb-1 text-lg font-bold">Rincian Pembayaran</h1>
                    <span>
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

            <Separator />
            <div className="space-y-7">
                <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
                {formData.order_type === OrderTypeEnum.DELIVERY && <SummaryRow label="Biaya Pengiriman" value={formatCurrency(deliveryFee)} />}
                <SummaryRow label="Biaya Layanan" value={formatCurrency(serviceCharge)} />
                <SummaryRow label="Diskon" value={`- ${formatCurrency(discount)}`} className="text-red-500" />
                <SummaryRow label="Pajak" value={formatCurrency(tax)} />
                <SummaryRow label="Total Akhir" value={formatCurrency(finalTotal)} isBold />

                {formData.order_type === OrderTypeEnum.DINEIN &&
                    (formData.payment_method === PaymentTypeEnum.CASH || formData.payment_method === PaymentTypeEnum.ONLINE_PAYMENT) && (
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

                {formData.payment_method === PaymentTypeEnum.CASH && formData.cash_received !== null && (
                    <SummaryRow
                        label="Kembalian"
                        value={formData.cash_received >= finalTotal ? formatCurrency(formData.cash_received - finalTotal) : formatCurrency(0)}
                        isBold
                    />
                )}

                <Textarea
                    className="mt-4 h-28"
                    placeholder="Tambahkan catatan (Optional)"
                    onChange={(e) => setData('note', e.target.value)}
                    value={formData.note}
                />

                {formData.payment_method === PaymentTypeEnum.ONLINE_PAYMENT ? (
                    <Button type="button" className="mt-4 w-full py-6 text-sm" disabled={processing} onClick={handlePayWithMidtrans}>
                        <Icon icon="mdi:credit-card" />
                        Bayar dengan Midtrans
                    </Button>
                ) : (
                    <Button type="submit" className="mt-4 w-full py-6 text-sm" disabled={processing} onClick={handlePayWithCash}>
                        <Icon icon="mdi:cash" />
                        Bayar dengan Cash / Tunai
                    </Button>
                )}
            </div>
        </Card>
    );
};

export default CheckoutSummary;
