
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
    <Link href={`/products/${product.id}`} className="group bg-white dark:bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative">
      {/* Favorite Button */}
      <button className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full text-muted-foreground hover:text-red-500 hover:scale-110 transition-all">
        <Heart className="w-5 h-5" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-secondary/30">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
          data-ai-hint={product.name}
        />
        {discount > 0 && (
          <div className="absolute bottom-3 left-3 bg-accent text-white text-[10px] font-bold px-2 py-1 rounded-full">
            {discount}% OFF
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <p className="text-xs text-muted-foreground font-medium mb-1 uppercase tracking-wider">{product.category}</p>
        <h3 className="font-headline font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        
        <div className="mb-3">
          <RatingStars rating={product.rating} count={product.reviewCount} />
        </div>

        <div className="flex items-baseline gap-2 mt-auto">
          <span className="text-lg font-bold text-foreground">
            ${product.price.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="mt-4 w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all rounded-xl"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </div>
    </Link>
  );
};
