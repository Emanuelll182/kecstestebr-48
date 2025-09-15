import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  category_slug?: string;
  is_active: boolean;
  order_position: number;
}

const BannerCarousel = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleBannerClick = (banner: Banner) => {
    if (banner.category_slug) {
      navigate(`/produtos?categoria=${banner.category_slug}`);
    } else if (banner.link_url) {
      window.open(banner.link_url, '_blank', 'noopener noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gradient-subtle animate-pulse rounded-lg mb-8" style={{ aspectRatio: '16/6' }} />
    );
  }

  if (banners.length === 0) {
    return (
      <div
        className="w-full bg-gradient-primary rounded-lg mb-8 flex items-center justify-center"
        style={{ aspectRatio: '16/6' }}
      >
        <div className="text-center text-primary-foreground">
          <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">KECINFORSTORE</h3>
          <p className="text-sm sm:text-lg lg:text-xl">Os melhores produtos em tecnologia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-">
      <Carousel plugins={[Autoplay({ delay: 40000 })]} className="w-full">
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div
                className="relative w-full rounded-lg overflow-hidden bg-muted cursor-pointer"
                style={{ aspectRatio: '4/1' }}
                onClick={() => handleBannerClick(banner)}
              >
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  style={{ filter: 'contrast(1.1) saturate(1.1) brightness(1.05)' }}
                  loading="eager"
                />
                <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 text-white">
                  <h3 className="text-sm sm:text-lg md:text-xl font-bold drop-shadow-lg">{banner.title}</h3>
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
