import { Transaction } from '@/models/transaction';
import UnassignedOrdersTable from './partials/table';
import { columns } from './partials/table/columns';

interface TabUnassignedOrdersProps {
    data: Transaction[];
}

const TabContentUnassignedOrders: React.FC<TabUnassignedOrdersProps> = ({ data }) => {
    return (
        <div className="mt-8">
            <UnassignedOrdersTable data={data} columns={columns} />
        </div>
    );
};

export default TabContentUnassignedOrders;
