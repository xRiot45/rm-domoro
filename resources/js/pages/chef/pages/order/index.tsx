import ChefLayout from '@/layouts/chef/layout';
import { Transaction } from '@/models/transaction';
import { Head } from '@inertiajs/react';
import MyOrdersTable from './partials/table';
import { columns } from './partials/table/columns';

interface OrderPageProps {
    myOrders: Transaction[];
}

export default function OrderPage({ myOrders }: OrderPageProps) {
    return (
        <>
            <ChefLayout>
                <Head title="Order" />
                <div className="mb-2 flex flex-wrap justify-between space-y-2 p-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-gray-800 dark:text-gray-200">Daftar Pesanan</h1>
                        <p className="text-muted-foreground mt-1.5 text-[16px]"> Tangani pesanan dari pelanggan</p>
                    </div>
                </div>

                <div className="p-4">
                    <MyOrdersTable data={myOrders} columns={columns} />
                </div>
            </ChefLayout>
        </>
    );
}
