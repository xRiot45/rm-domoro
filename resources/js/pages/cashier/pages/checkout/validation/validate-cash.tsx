import showErrorToast from '@/components/error-toast';
import { OrderTypeEnum } from '@/enums/order-type';
import { TransactionForm } from '@/models/transaction';

const validateFormCash = ({ formData }: { formData: TransactionForm }) => {
    const { order_type, table_number, recipient, recipient_phone_number, shipping_address, cash_received } = formData;
    if (order_type === OrderTypeEnum.DINEIN && (!table_number.trim() || !cash_received)) {
        showErrorToast('Nomor meja dan jumlah uang yang diterima harus diisi untuk pemesanan Dine In.');
        return false;
    }
    if (order_type === OrderTypeEnum.TAKEAWAY && (!recipient.trim() || !cash_received)) {
        showErrorToast('Nama penerima dan jumlah uang yang diterima harus diisi untuk pemesanan Takeaway.');
        return false;
    }
    if (order_type === OrderTypeEnum.DELIVERY && (!shipping_address.trim() || !recipient.trim() || !recipient_phone_number.trim())) {
        showErrorToast('Alamat pengiriman, nama penerima, nomor telepon penerima harus diisi untuk pemesanan Delivery.');
        return false;
    }
    if (order_type === OrderTypeEnum.PICKUP && (!recipient.trim() || !recipient_phone_number.trim())) {
        showErrorToast('Nama penerima, nomor telepon penerima harus diisi untuk pemesanan Pickup.');
        return false;
    }
    return true;
};

export default validateFormCash;
