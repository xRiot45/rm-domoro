import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CashierLayout from '@/layouts/cashier/layout';
import { Transaction } from '@/models/transaction';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import TabMyOrders from './shared/tab-my-orders';
import TabContentUnassignedOrders from './shared/tab-unassigned-orders';

interface OrderPageProps {
    unassignedOrders: Transaction[];
    myOrders: Transaction[];
}

export default function OrderPage({ unassignedOrders, myOrders }: OrderPageProps) {
    const [activeTab, setActiveTab] = useState<string>('unassignedOrders');
    const [liveUnassignedOrders, setLiveUnassignedOrders] = useState<Transaction[]>(unassignedOrders);
    const [liveMyOrders, setLiveMyOrders] = useState<Transaction[]>(myOrders);

    const handleNewOrder = (newOrder: Transaction) => {
        setLiveUnassignedOrders((prevOrders) => [newOrder, ...prevOrders]);
    };

    const handleOrderTaken = (takenOrder: Transaction) => {
        setLiveUnassignedOrders((prev) => prev.filter((order) => order.id !== takenOrder.id));
        setLiveMyOrders((prev) => [takenOrder, ...prev]);
        setActiveTab('myOrders');
    };

    const handleUpdateStatusOrder = (updatedOrder: Transaction) => {
        setLiveMyOrders((prev) => prev.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
    };

    return (
        <>
            <CashierLayout onNewOrder={handleNewOrder}>
                <Head title="Order" />
                <div className="mt-2 flex flex-1 flex-col gap-4 rounded-xl p-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Daftar Pesanan</h1>
                        <p className="text-muted-foreground mt-1.5 text-[16px]"> Tangani pesanan dari pelanggan dan yang anda buat</p>
                    </div>

                    <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4 w-full">
                        <TabsList className="w-fit">
                            <TabsTrigger value="unassignedOrders" className="cursor-pointer">
                                Pesanan Yang Belum Ditangani
                            </TabsTrigger>
                            <TabsTrigger value="myOrders" className="cursor-pointer">
                                Pesanan Yang Saya Tangani
                            </TabsTrigger>
                        </TabsList>

                        {/* Kontent untuk tab "Pesanan Yang Belum Ditangani" */}
                        <TabsContent value="unassignedOrders">
                            <TabContentUnassignedOrders data={liveUnassignedOrders} onOrderTaken={handleOrderTaken} />
                        </TabsContent>

                        {/* Konten untuk tab "Pesanan Yang Saya Tangani" */}
                        <TabsContent value="myOrders">
                            <TabMyOrders data={liveMyOrders} onUpdateStatusOrder={handleUpdateStatusOrder} />
                        </TabsContent>
                    </Tabs>
                </div>
            </CashierLayout>
        </>
    );
}
