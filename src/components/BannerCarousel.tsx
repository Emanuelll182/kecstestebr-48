import { useEffect, useState } from 'react';
import { supabasePublic as supabase } from '@/integrations/supabase/publicClient';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';

interface Banner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  is_active: boolean;
  order_position: number;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('order_position', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[200px] md:h-[400px] lg:h-[600px] bg-gray-200 animate-pulse rounded-xl" />
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[200px] md:h-[400px] lg:h-[600px] flex items-center justify-center bg-gray-100 rounded-xl">
        <div className="text-center text-primary-foreground">
          <h3 className="text-2xl md:text-4xl font-bold mb-2">KECINFORSTORE</h3>
          <p className="text-base md:text-xl">Os melhores produtos em tecnologia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <Carousel
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        className="w-full"
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="w-100px md:w-[fullpx] h-[150px] md:h-[400px] lg:h-[400px] overflow-hidden rounded-xl">
                {banner.link_url ? (
                  <a href={banner.link_url} target="_blank" rel="noopener noreferrer">
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      style={{ filter: 'contrast(1.1) saturate(1.1) brightness(1.05)' }}
                      loading="eager"
                    />
                  </a>
                ) : (
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    style={{ filter: 'contrast(1.1) saturate(1.1) brightness(1.05)' }}
                    loading="eager"
                  />
                )}
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h2 className="text-base md:text-x2 font-bold">{banner.title}</h2>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4" />
        <CarouselNext className="right-4" />
      </Carousel>
    </div>
  );
};

export default BannerCarousel;
