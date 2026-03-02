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
      <div className="relative aspect-square overflow-hidden bg-white flex items-center justify-center p-4">
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
            No Image Available
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[40px]">
          {product.name}
        </h3>
        
        <div className="flex justify-start mb-2">
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
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
            className="w-full bg-primary/5 hover:bg-primary hover:text-white rounded-sm text-xs font-bold h-10 border-none uppercase transition-colors"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};