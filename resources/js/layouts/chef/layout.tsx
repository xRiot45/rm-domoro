import OrderBellAudio from '@/assets/sounds/order-bell.mp3';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Transaction } from '@/models/transaction';
import { type BreadcrumbItem } from '@/types';
import { Icon } from '@iconify/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import LithiumLayoutTemplate from './layouts/lithium-layout/index';

interface ChefLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    onNewOrder?: (order: Transaction) => void;
}

export default function ChefLayout({ children, breadcrumbs, onNewOrder, ...props }: ChefLayoutProps) {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
        return localStorage.getItem('soundIsEnabled') === 'true';
    });

    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        const audio = new Audio(OrderBellAudio);
        audio.preload = 'auto';
        audioRef.current = audio;

        audio.addEventListener('ended', () => {
            audio.currentTime = 0;
        });

        return () => {
            audio.pause();
            audio.removeEventListener('ended', () => {
                audio.currentTime = 0;
            });
        };
    }, []);

    useEffect(() => {
        if (!window.Echo || !isSoundEnabled) return;

        const channel = window.Echo.channel(`orders.to-chef`);
        channel.listen('.order-assigned-to-chef', (event: { transaction: Transaction }) => {
            const audio = audioRef.current;
            // if (onNewOrder != null && event.transaction) {
            //     if (audio) {
            //         audio.currentTime = 0;
            //         audio.play();
            //     }

            //     setShowDialog(true);
            //     onNewOrder(event.transaction);
            // }
            if (event.transaction) {
                if (audio) {
                    audio.currentTime = 0;
                    audio.play();
                }

                setShowDialog(true);

                if (typeof onNewOrder === 'function') {
                    onNewOrder(event.transaction);
                }
            }
        });

        return () => {
            channel.stopListening('.order-assigned-to-chef');
            window.Echo.leave(`orders.to-chef`);
        };
    }, [onNewOrder, isSoundEnabled]);

    const handleEnableSound = () => {
        const audio = audioRef.current;
        if (!audio) return;

        audio
            .play()
            .then(() => {
                setIsSoundEnabled(true);
                localStorage.setItem('soundIsEnabled', 'true');
            })
            .catch(() => {
                alert('Browser memblokir audio. Coba klik ulang tombol.');
            });
    };

    const handleDisabledSound = () => {
        setIsSoundEnabled(false);
        localStorage.setItem('soundIsEnabled', 'false');
    };

    return (
        <LithiumLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            <div className="px-4">
                {isSoundEnabled ? (
                    <Alert className="mt-4">
                        <Icon icon="material-symbols:done-rounded" className="h-4 w-4" />
                        <AlertTitle className="font-bold">Notifikasi Suara Aktif</AlertTitle>
                        <AlertDescription>
                            Notifikasi suara telah aktif. Anda akan mendengar suara setiap kali ada pesanan baru.
                            <div className="mt-2">
                                <Button onClick={handleDisabledSound}>Nonaktifkan Notifikasi Suara</Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                ) : (
                    <Alert className="mt-4">
                        <Icon icon="material-symbols:info-outline" className="h-4 w-4" />
                        <AlertTitle className="font-bold">Notifikasi Suara Tidak Aktif</AlertTitle>
                        <AlertDescription>
                            Notifikasi suara belum aktif. Klik tombol di bawah untuk mengaktifkan.
                            <div className="mt-2">
                                <Button onClick={handleEnableSound}>Aktifkan Notifikasi Suara</Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}
            </div>

            {children}

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Pesanan Baru!!</DialogTitle>
                        <DialogDescription>Ada pesanan baru yang telah masuk. Silahkan lakukan pengecekan dan masak pesanan!.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setShowDialog(false)}>Pesanan Sudah Saya Terima</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </LithiumLayoutTemplate>
    );
}
