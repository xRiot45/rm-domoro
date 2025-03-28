import AdsImageOne from '@/assets/images/ads/ads-1.png';
import AdsImageTwo from '@/assets/images/ads/ads-2.png';
import AdsImageThree from '@/assets/images/ads/ads-3.png';
import { Carousel, CarouselContent } from '@/components/ui/carousel';
import AppLayout from '@/layouts/app/layout';
import { MenuItems } from '@/models/menu-items';
import { Head } from '@inertiajs/react';
import Autoplay from 'embla-carousel-autoplay';
import MenuItemCard from './components/menu-item-card';

export default function CustomerPage({ data }: { data: MenuItems[] }) {
    return (
        <>
            <AppLayout>
                <Head title="Beranda" />
                <Carousel
                    className="w-auto rounded-2xl"
                    plugins={[
                        Autoplay({
                            delay: 1500,
                        }),
                    ]}
                >
                    <CarouselContent className="mt-6">
                        <img src={AdsImageOne} alt="" />
                        <img src={AdsImageTwo} alt="" />
                        <img src={AdsImageThree} alt="" />
                    </CarouselContent>
                </Carousel>

                <div className="mt-20 mb-8 text-center">
                    <h1 className="text-3xl font-black">Jelajahi Hidangan Lezat Kami</h1>
                    <p className="text-muted-foreground mt-1 text-lg">Temukan berbagai pilihan menu spesial dari restoran kami</p>
                </div>
                <MenuItemCard menuItems={data.slice(0, 8)} />
            </AppLayout>
        </>
    );
}
