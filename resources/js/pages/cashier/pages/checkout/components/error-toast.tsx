import { toast } from 'sonner';

const showErrorToast = (message: string) =>
    toast.error('Gagal', {
        description: message,
        action: { label: 'Tutup', onClick: () => toast.dismiss() },
    });

export default showErrorToast;
