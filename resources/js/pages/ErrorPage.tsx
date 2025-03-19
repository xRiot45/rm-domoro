import BadRequestImg from '@/assets/errors/400.svg';
import UnauthorizedImg from '@/assets/errors/401.svg';
import ForbiddenImg from '@/assets/errors/403.svg';
import NotFoundImg from '@/assets/errors/404.svg';
import ServerErrorImg from '@/assets/errors/500.svg';
import ServiceUnavailableImg from '@/assets/errors/503.svg';
import { Button } from '@/components/ui/button';

interface ErrorPageProps {
    status: number;
    message?: string;
}

export default function ErrorPage({ status, message }: ErrorPageProps) {
    const getErrorTitle = () => {
        switch (status) {
            case 404:
                return 'Halaman Tidak Ditemukan';
            case 500:
                return 'Kesalahan Server';
            case 403:
                return 'Akses Ditolak';
            case 401:
                return 'Tidak Terautentikasi';
            case 400:
                return 'Permintaan Tidak Valid';
            case 503:
                return 'Layanan Tidak Tersedia';
            default:
                return 'Terjadi Kesalahan';
        }
    };

    const getErrorMessage = () => {
        switch (status) {
            case 404:
                return 'Halaman yang Anda cari tidak ditemukan. Kemungkinan telah dihapus atau URL yang dimasukkan salah.';
            case 500:
                return 'Terjadi kesalahan pada server saat memproses permintaan Anda. Silakan coba lagi nanti.';
            case 403:
                return 'Anda tidak memiliki izin untuk mengakses halaman ini.';
            case 401:
                return 'Anda perlu login untuk mengakses halaman ini.';
            case 400:
                return 'Permintaan tidak valid. Pastikan input yang Anda masukkan benar.';
            case 503:
                return 'Server sedang dalam pemeliharaan atau mengalami gangguan sementara.';
            default:
                return message || 'Terjadi kesalahan.';
        }
    };

    const getErrorImage = () => {
        switch (status) {
            case 404:
                return NotFoundImg;
            case 500:
                return ServerErrorImg;
            case 403:
                return ForbiddenImg;
            case 401:
                return UnauthorizedImg;
            case 400:
                return BadRequestImg;
            case 503:
                return ServiceUnavailableImg;
            default:
                return ServerErrorImg;
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-[#171717]">
            <div className="flex grow items-center px-6 xl:px-10">
                <div className="mx-auto text-center">
                    <img src={getErrorImage()} alt="Error" className="mx-auto mb-8 w-full max-w-lg lg:mb-12 2xl:mb-16" />
                    <h1 className="text-gray-1000 text-[22px] leading-normal font-bold text-gray-700 lg:text-3xl dark:text-gray-100">
                        {getErrorTitle()}
                    </h1>
                    <p className="mt-3 text-sm leading-loose text-gray-500 lg:mt-6 lg:text-base lg:leading-loose dark:text-gray-400">
                        {getErrorMessage()}
                    </p>

                    <div className="mt-6">
                        <Button className="cursor-pointer" onClick={() => window.history.back()}>
                            Kembali ke halaman sebelumnya
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
