import { Transaction } from '@/models/transaction';
import UnassignedOrdersTable from './partials/table';
import { columns } from './partials/table/columns';

interface TabUnassignedOrdersProps {
    data: Transaction[];
    onOrderTaken: (order: Transaction) => void;
}

const TabContentUnassignedOrders: React.FC<TabUnassignedOrdersProps> = ({ data, onOrderTaken }) => {
    return (
        <div className="mt-8">
            <UnassignedOrdersTable data={data} columns={columns(onOrderTaken)} />
        </div>
    );
};

export default TabContentUnassignedOrders;
