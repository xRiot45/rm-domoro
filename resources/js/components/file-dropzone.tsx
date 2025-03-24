import InputError from '@/components/input-error';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileDropzoneProps {
    onFileChange: (file: File | null) => void;
    error?: string;
    initialImage?: string | null;
}

export default function FileDropzone({ onFileChange, error, initialImage }: FileDropzoneProps) {
    const [preview, setPreview] = useState<string | null>(initialImage || null);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: { 'image/*': [] },
        onDrop: (acceptedFiles: File[]) => {
            const uploadedFile = acceptedFiles[0];
            setPreview(URL.createObjectURL(uploadedFile));
            onFileChange(uploadedFile);
        },
    });

    return (
        <div className="w-full">
            <Card
                {...getRootProps()}
                className={cn(
                    'mt-2 flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-10 shadow-none',
                    isDragActive ? 'border-blue-500 bg-blue-50' : '',
                    error && 'border-red-500',
                )}
            >
                <input id="image_url" {...getInputProps()} />
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="mt-2 max-h-40 rounded-lg shadow" />
                        <p className="text-sm text-gray-500">Drag & drop gambar di sini, atau klik untuk memilih</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, atau JPEG (MAX: 2 MB)</p>
                    </>
                ) : (
                    <>
                        <UploadCloud className="h-16 w-16 text-gray-500 dark:text-white" />
                        <p className="text-sm text-gray-500 dark:text-white">Drag & drop gambar di sini, atau klik untuk memilih</p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-white">PNG, JPG, atau JPEG (MAX: 2 MB)</p>
                    </>
                )}
            </Card>
            {error && <InputError message={error} className="mt-2" />}
        </div>
    );
}
