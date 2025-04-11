import { Transaction } from '@/models/transaction';
import MyOrdersTable from './partials/table';
import { columns } from './partials/table/columns';

interface TabMyOrdersProps {
    data: Transaction[];
}

const TabMyOrders: React.FC<TabMyOrdersProps> = ({ data }) => {
    return (
        <div className="mt-8">
            <MyOrdersTable data={data} columns={columns} />
        </div>
    );
};

export default TabMyOrders;
