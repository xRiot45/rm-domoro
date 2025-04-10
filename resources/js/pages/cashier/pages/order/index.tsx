import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CashierLayout from '@/layouts/cashier/layout';
import { Transaction } from '@/models/transaction';
import { Head } from '@inertiajs/react';
import TabMyOrders from './shared/tab-my-orders';
import TabContentUnassignedOrders from './shared/tab-unassigned-orders';

interface OrderPageProps {
    unassignedOrders: Transaction[];
    myOrders: Transaction[];
}

export default function OrderPage({ unassignedOrders, myOrders }: OrderPageProps) {
    return (
        <>
            <CashierLayout>
                <Head title="Order" />
                <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl p-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Daftar Pesanan</h1>
                        <p className="text-muted-foreground mt-1.5 text-[16px]"> Tangani pesanan dari pelanggan dan yang anda buat</p>
                    </div>

                    <Tabs defaultValue="unassignedOrders" className="mt-4 w-full">
                        <TabsList className="w-fit">
                            <TabsTrigger value="unassignedOrders" className="cursor-pointer">
                                Pesanan Yang Belum Ditangani
                            </TabsTrigger>
                            <TabsTrigger value="myOrders" className="cursor-pointer">
                                Pesanan Yang Saya Tangani
                            </TabsTrigger>
                        </TabsList>

                        {/* Kontent untuk tab "Pesanan Yang Belum Ditangani" */}
                        <TabContentUnassignedOrders data={unassignedOrders} />

                        {/* Konten untuk tab "Pesanan Yang Saya Tangani" */}
                        <TabMyOrders data={myOrders} />
                    </Tabs>
                </div>
            </CashierLayout>
        </>
    );
}
