import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useStoreSettings } from '@/hooks/useStoreSettings';
import { useStoreCredentials } from '@/hooks/useStoreCredentials';

interface Product {
  id: string;
  name: string;
  price_varejo: number;
  price_revenda: number;
  image_url?: string;
}

interface AddToCartButtonProps {
  product: Product;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default';
  className?: string;
}

const AddToCartButton = ({ 
  product, 
  variant = 'default', 
  size = 'default',
  className = '' 
}: AddToCartButtonProps) => {
  const { addItem } = useCart();
  const { salesEnabled } = useStoreSettings();
  const { currentSector } = useStoreCredentials();

  // Don't render if sales are disabled
  if (!salesEnabled) {
    return null;
  }

  const price = currentSector === 'revenda' ? product.price_revenda : product.price_varejo;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      image_url: product.image_url
    });
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={variant}
      size={size}
      className={`${className} transition-all hover:scale-105`}
    >
      {size === 'sm' ? (
        <Plus className="h-4 w-4" />
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Adicionar
        </>
      )}
    </Button>
  );
};

export default AddToCartButton;