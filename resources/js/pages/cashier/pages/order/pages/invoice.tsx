import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { OrderTypeEnum } from '@/enums/order-type';
import { PaymentStatusEnum } from '@/enums/payment-status';
import AppLayout from '@/layouts/app/layout';
import { Transaction } from '@/models/transaction';
import { formatCurrency } from '@/utils/format-currency';
import { formatDate } from '@/utils/format-date';
import { paymentStatusMap } from '@/utils/payment-status-map';
import { Icon } from '@iconify/react';
import { Head } from '@inertiajs/react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface InvoiceOrderProps {
    data: Transaction;
}

export default function InvoiceOrderPage({ data }: InvoiceOrderProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const handlePrint = useReactToPrint({ contentRef, documentTitle: `Invoice - ${data.order_number}` });

    return (
        <>
            <AppLayout>
                <Head title="Detail Order" />
                <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl py-4">
                    <div className="mb-4 flex flex-col items-center justify-between gap-2 md:flex-row">
                        <Button className="w-full cursor-pointer md:w-fit" variant="default" onClick={() => window.history.back()}>
                            <Icon icon="mdi:arrow-left" className="mr-2 h-4 w-4" />
                            Kembali ke halaman sebelumnya
                        </Button>

                        <Button
                            className="w-full cursor-pointer bg-green-600 hover:bg-green-700 md:w-fit"
                            variant="default"
                            onClick={() => handlePrint()}
                        >
                            <Icon icon="mdi:printer" className="mr-2 h-4 w-4" />
                            Print Invoice
                        </Button>
                    </div>

                    {/* Detail Pesanan */}
                    <div ref={contentRef}>
                        <Card className="print rounded-2xl shadow-none">
                            <CardContent className="space-y-4 p-6 lg:p-8">
                                <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                    <h1 className="text-xl font-black tracking-tight text-gray-800 dark:text-gray-200">Detail Transaksi</h1>
                                    <div>
                                        <div className="text-muted-foreground text-sm">
                                            Nomor Pesanan : <span className="font-medium text-black">{data.order_number}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-sm">
                                    <Icon icon="mdi:credit-card-check-outline" className="text-primary h-4 w-4" />
                                    <span className="text-muted-foreground">Status Pembayaran :</span>
                                    <Badge variant="default" className={paymentStatusMap[data.payment_status as PaymentStatusEnum]?.className}>
                                        {paymentStatusMap[data.payment_status as PaymentStatusEnum]?.label ?? data.payment_status}
                                    </Badge>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-5 text-sm">
                                    <div>
                                        <h1 className="font-bold">Nama Lengkap Penerima</h1>
                                        <p className="text-muted-foreground capitalize">{data?.customer?.user?.full_name || '-'}</p>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Nomor Telepon Penerima</h1>
                                        <p className="text-muted-foreground capitalize">{data?.customer?.user?.phone_number || '-'}</p>
                                    </div>
                                    <div>
                                        <h1 className="font-bold">Catatan Untuk Kurir</h1>
                                        <p className="text-muted-foreground capitalize">{data?.customer?.note || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Jenis Pesanan</p>
                                        <p className="text-muted-foreground capitalize">{data?.order_type || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Metode Pembayaran</p>
                                        <p className="text-muted-foreground capitalize">{data?.payment_method || '-'}</p>
                                    </div>
                                    {data?.order_type === OrderTypeEnum.DELIVERY && (
                                        <div>
                                            <p className="font-bold">Alamat Pengiriman</p>
                                            <p className="text-muted-foreground">{data?.customer?.address || '-'}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold">Label Alamat</p>
                                        <p className="text-muted-foreground capitalize">{data?.customer?.address_label || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="font-bold">Tanggal Pemesanan</p>
                                        <p className="text-muted-foreground capitalize">{formatDate(data?.created_at || '') || '-'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <p className="mb-4 font-bold">Menu Pesanan</p>
                                    <ScrollArea className="s scroll-print h-48 pr-4">
                                        {data.transaction_items.map((item, index) => (
                                            <div key={index} className="mb-4 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={`${item.menu_item.image_url}`}
                                                        alt={item.menu_item.name}
                                                        className="h-16 w-16 rounded-md object-cover"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {item.menu_item.name} x{item.quantity}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">{formatCurrency(item.menu_item.price)}</p>
                                                    </div>
                                                </div>
                                                <p className="text-sm font-semibold">{formatCurrency(item.subtotal)}</p>
                                            </div>
                                        ))}
                                    </ScrollArea>
                                </div>

                                <Separator />

                                <div className="space-y-6 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Harga</span>
                                        <span>{formatCurrency(data.total_price)}</span>
                                    </div>
                                    {data.order_type === OrderTypeEnum.DELIVERY && (
                                        <div className="flex justify-between">
                                            <span>Biaya Pengiriman</span>
                                            <span>{formatCurrency(data.delivery_fee)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between">
                                        <span>Biaya Layanan</span>
                                        <span>{formatCurrency(data.service_charge)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Diskon</span>
                                        <span className="text-red-500">-{formatCurrency(data.discount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Pajak</span>
                                        <span>{formatCurrency(data.tax)}</span>
                                    </div>
                                    <Separator className="my-4" />
                                    <div className="flex justify-between font-bold">
                                        <span>Total Akhir</span>
                                        <span>{formatCurrency(data.final_total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </AppLayout>
        </>
    );
}
