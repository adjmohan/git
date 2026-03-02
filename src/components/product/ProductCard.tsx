
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
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
      description: `${product.name} added to cart.`,
    });
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;

  return (
    <Link href={`/products/${product.id}`} className="group bg-white dark:bg-card rounded shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative border border-transparent hover:border-gray-200 overflow-hidden">
      {/* Favorite Button */}
      <button className="absolute top-3 right-3 z-10 p-1.5 bg-white/95 rounded-full text-gray-300 hover:text-red-500 transition-all border border-gray-100 shadow-sm">
        <Heart className="w-4 h-4 fill-current" />
      </button>

      {/* Product Image Area */}
      <div className="relative h-48 sm:h-56 overflow-hidden bg-white flex items-center justify-center p-6">
        {product.image ? (
          <div className="relative w-full h-full">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 text-muted-foreground text-xs">
            No Image
          </div>
        )}
      </div>

      {/* Product Details Area */}
      <div className="p-4 flex flex-col flex-grow bg-white">
        <h3 className="font-medium text-sm mb-1.5 line-clamp-2 group-hover:text-primary transition-colors min-h-[40px]">
          {product.name}
        </h3>
        
        <div className="flex justify-start mb-2.5">
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
            {discount > 0 && (
              <span className="text-xs text-green-600 font-bold">
                {discount}% off
              </span>
            )}
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            className="w-full bg-white border border-gray-200 hover:bg-primary hover:text-white hover:border-primary rounded-sm text-xs font-bold h-10 uppercase transition-all"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};
