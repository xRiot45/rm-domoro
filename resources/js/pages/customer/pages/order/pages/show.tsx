import { Transaction } from '@/models/transaction';

interface DetailOrderProps {
    data: Transaction;
}

export default function DetailOrder({ data }: DetailOrderProps) {
    return (
        <>
            <h1>Detail Ordeeran</h1>
        </>
    );
}
