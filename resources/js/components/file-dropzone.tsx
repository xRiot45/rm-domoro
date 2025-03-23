import InputError from '@/components/input-error';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
    onFileChange: (file: File | null) => void;
    error?: string;
}

export default function FileDropzone({ onFileChange, error }: FileDropzoneProps) {
    const [file, setFile] = useState<File | null>(null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (acceptedFiles: File[]) => {
            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            onFileChange(uploadedFile);
        },
    });

    return (
        <div className="w-full">
            <Card
                {...getRootProps()}
                className={cn(
                    'mt-2 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-10 shadow-none',
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
                    error && 'border-red-500',
                )}
            >
                <input id="image_url" {...getInputProps()} />
                {file ? (
                    <>
                        <img src={URL.createObjectURL(file)} alt="Preview" className="mt-2 max-h-40 rounded-lg shadow" />
                        <p className="text-sm text-gray-500">Drag & drop gambar di sini, atau klik untuk memilih</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, atau JPEG (MAX: 2 MB)</p>
                    </>
                ) : (
                    <>
                        <UploadCloud className="h-16 w-16 text-gray-500" />
                        <p className="text-sm text-gray-500">Drag & drop gambar di sini, atau klik untuk memilih</p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">PNG, JPG, atau JPEG (MAX: 2 MB)</p>
                    </>
                )}
            </Card>
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
