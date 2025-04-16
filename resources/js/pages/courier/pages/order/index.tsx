import CourierLayout from '@/layouts/courier/layout';
import { Head } from '@inertiajs/react';

export default function OrderPage() {
    return (
        <>
            <CourierLayout>
                <Head title="Order" />
                <h1>Halamaan order</h1>
            </CourierLayout>
        </>
    );
}
