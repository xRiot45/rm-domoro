import PaymentFailedImg from '@/assets/images/payment/payment-failed.png';
import { Button } from '@/components/ui/button';

export default function TransactionFailedPage() {
    return (
        <>
            <div className="flex min-h-screen flex-col bg-white dark:bg-[#171717]">
                <div className="flex grow items-center px-6 xl:px-10">
                    <div className="mx-auto text-center">
                        <img src={PaymentFailedImg} alt="Error" className="mx-auto mb-8 w-full max-w-lg lg:mb-12 2xl:mb-16" />
                        <h1 className="text-gray-1000 text-[22px] leading-normal font-bold text-gray-700 lg:text-3xl dark:text-gray-100">
                            Pembayaran Gagal
                        </h1>
                        <p className="mt-3 text-sm leading-loose text-gray-500 lg:mt-6 lg:text-base lg:leading-loose dark:text-gray-400">
                            Maaf pembayaran Anda gagal. Silakan coba lagi.
                        </p>

                        <div className="mt-6">
                            <Button className="cursor-pointer" onClick={() => window.history.back()}>
                                Kembali ke halaman sebelumnya
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
