import FileDropzone from '@/components/file-dropzone';
import { AlertDialogCancel, AlertDialogFooter } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';

interface FormDialogOrderCompletedProps {
    onSubmit: (data: PropsForm) => void;
    isCash: boolean;
}

interface PropsForm {
    proof_photo: File | null;
    cash_received: number;
}

const FormDialogOrderCompleted = ({ onSubmit, isCash }: FormDialogOrderCompletedProps) => {
    const { data, setData, processing, errors } = useForm<Required<PropsForm>>({
        proof_photo: null,
        cash_received: 0,
    });

    const handleFileChange = (file: File | null) => {
        setData('proof_photo', file);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="proof_photo">Upload Bukti Foto</Label>
                        {/* <Input type="file" /> */}
                        <FileDropzone onFileChange={handleFileChange} error={errors.proof_photo} />
                        {errors.proof_photo && <p className="text-sm text-red-500">Foto wajib diunggah.</p>}
                    </div>

                    {isCash && (
                        <div className="grid gap-2">
                            <Label htmlFor="cash_received">Cash Diterima</Label>
                            <Input
                                type="number"
                                placeholder="Masukkan nominal cash"
                                onChange={(e) => setData('cash_received', parseInt(e.target.value))}
                            />
                            {errors.cash_received && <p className="text-sm text-red-500">Wajib diisi jika pembayaran tunai.</p>}
                        </div>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <Button type="submit" disabled={processing}>
                        Selesaikan Pesanan
                    </Button>
                </AlertDialogFooter>
            </form>
        </>
    );
};

export default FormDialogOrderCompleted;
