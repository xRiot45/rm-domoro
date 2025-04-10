import { TabsContent } from '@/components/ui/tabs';
import { Transaction } from '@/models/transaction';
import UnassignedOrdersTable from './partials/table';
import { columns } from './partials/table/columns';

interface TabUnassignedOrdersProps {
    data: Transaction[];
}

const TabContentUnassignedOrders: React.FC<TabUnassignedOrdersProps> = ({ data }) => {
    console.log(data);
    return (
        <TabsContent value="unassignedOrders">
            {/* Konten untuk tab "Pesanan Masuk" */}
            <div className="mt-8">
                <UnassignedOrdersTable data={data} columns={columns} />
            </div>
        </TabsContent>
    );
};

export default TabContentUnassignedOrders;
