
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { RatingStars } from './RatingStars';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/store/useCartStore';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your shopping cart.`,
    });
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group bg-white dark:bg-card rounded shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative border border-transparent hover:border-border overflow-hidden">
      {/* Favorite Button */}
      <button className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 rounded-full text-muted-foreground hover:text-red-500 transition-all border border-gray-100 shadow-sm">
        <Heart className="w-4 h-4" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-white flex items-center justify-center">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-3 flex flex-col flex-grow text-left space-y-2">
        <h3 className="font-bold text-sm mb-1 line-clamp-1 group-hover:text-primary transition-colors h-5 overflow-hidden">
          {product.name}
        </h3>
        
        <div className="flex justify-start">
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>

        <div className="flex flex-col items-start gap-1 mt-auto">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="text-[10px] text-green-600 font-bold">
                {discount}% off
              </span>
            )}
          </div>
        </div>

        <Button 
          variant="secondary" 
          size="sm" 
          className="mt-2 w-full bg-primary/5 hover:bg-primary hover:text-white rounded-sm text-xs h-8 border-none"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};
