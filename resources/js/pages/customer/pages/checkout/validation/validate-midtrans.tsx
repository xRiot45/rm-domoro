import showErrorToast from '@/components/error-toast';
import { OrderTypeEnum } from '@/enums/order-type';
import { TransactionForm } from '@/models/transaction';

const validateFormMidtrans = ({ formData }: { formData: TransactionForm }) => {
    const { order_type, table_number, recipient, recipient_phone_number, shipping_address } = formData;
    if (order_type === OrderTypeEnum.DINEIN && !table_number.trim()) {
        showErrorToast('Nomor meja harus diisi untuk pemesanan Dine In.');
        return false;
    }
    if (order_type === OrderTypeEnum.TAKEWAY && !recipient.trim()) {
        showErrorToast('Nama penerima harus diisi untuk pemesanan Takeway.');
        return false;
    }
    if (order_type === OrderTypeEnum.DELIVERY && (!shipping_address.trim() || !recipient.trim() || !recipient_phone_number.trim())) {
        showErrorToast('Alamat pengiriman, nama penerima, dan nomor telepon penerima harus diisi untuk pemesanan Delivery.');
        return false;
    }
    if (order_type === OrderTypeEnum.PICKUP && (!recipient.trim() || !recipient_phone_number.trim())) {
        showErrorToast('Nama penerima dan nomor telepon penerima harus diisi untuk pemesanan Pickup.');
        return false;
    }
    return true;
};

export default validateFormMidtrans;
