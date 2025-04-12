import PaymentSuccessImg from '@/assets/images/payment/payment-success.png';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function TransactionSuccessPage() {
    return (
        <>
            <div className="flex min-h-screen flex-col bg-white dark:bg-[#171717]">
                <div className="flex grow items-center px-6 xl:px-10">
                    <div className="mx-auto text-center">
                        <img src={PaymentSuccessImg} alt="Error" className="mx-auto mb-8 w-full max-w-lg lg:mb-12 2xl:mb-16" />
                        <h1 className="text-gray-1000 text-[22px] leading-normal font-bold text-gray-700 lg:text-3xl dark:text-gray-100">
                            Pembayaran Berhasil
                        </h1>
                        <p className="mt-3 text-sm leading-loose text-gray-500 lg:mt-6 lg:text-base lg:leading-loose dark:text-gray-400">
                            Terima kasih telah melakukan pembayaran. Silahkan kembali ke halaman menu
                        </p>

                        <div className="mt-6">
                            <Link href={route('cashier.cart.index')}>
                                <Button className="cursor-pointer">Kembali ke halaman menu</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
