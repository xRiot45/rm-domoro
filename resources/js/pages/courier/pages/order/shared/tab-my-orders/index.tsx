import { Transaction } from '@/models/transaction';
import MyOrdersTable from './partials/table';
import { columns } from './partials/table/columns';

interface TabMyOrdersProps {
    data: Transaction[];
    onUpdateStatusOrder: (transaction: Transaction) => void;
    onUpdatePaymentStatusOrder: (transaction: Transaction) => void;
}

const TabMyOrders: React.FC<TabMyOrdersProps> = ({ data, onUpdateStatusOrder, onUpdatePaymentStatusOrder }) => {
    return (
        <div className="mt-8">
            <MyOrdersTable data={data} columns={columns(onUpdateStatusOrder, onUpdatePaymentStatusOrder)} />
        </div>
    );
};

export default TabMyOrders;
