
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ProductCard } from '@/components/product/ProductCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Product } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';

// Stable mock data to avoid hydration mismatches from Math.random()
const staticProducts: Product[] = [
  {
    id: 'p-0',
    name: 'Smartphone Ultra Pro Max',
    description: 'The latest technology in the palm of your hand.',
    price: 999,
    originalPrice: 1099,
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 1250,
    image: PlaceHolderImages[0].imageUrl,
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p-1',
    name: 'Wireless Noise Cancelling Headphones',
    description: 'Experience pure sound with our flagship headphones.',
    price: 299,
    originalPrice: 349,
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 850,
    image: PlaceHolderImages[1].imageUrl,
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p-2',
    name: 'Classic Leather Watch',
    description: 'Timeless design for the modern professional.',
    price: 150,
    originalPrice: 199,
    category: 'Fashion',
    rating: 4.7,
    reviewCount: 420,
    image: PlaceHolderImages[2].imageUrl,
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p-3',
    name: 'Cotton Casual T-Shirt',
    description: 'Comfortable everyday wear made from 100% cotton.',
    price: 25,
    originalPrice: 35,
    category: 'Fashion',
    rating: 4.4,
    reviewCount: 2100,
    image: PlaceHolderImages[3].imageUrl,
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p-4',
    name: 'Smart Home Hub',
    description: 'Control your entire home with one simple device.',
    price: 129,
    originalPrice: 149,
    category: 'Electronics',
    rating: 4.5,
    reviewCount: 310,
    image: PlaceHolderImages[4].imageUrl,
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p-5',
    name: 'Premium Coffee Maker',
    description: 'Brew the perfect cup of coffee every single morning.',
    price: 79,
    originalPrice: 99,
    category: 'Home',
    rating: 4.3,
    reviewCount: 1200,
    image: PlaceHolderImages[5].imageUrl,
    thumbnails: [],
    inStock: true,
    specifications: {}
  }
];

export default function ProductsPage() {
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground font-medium">All Products</span>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-72 space-y-8 shrink-0">
          <div className="flex items-center justify-between">
            <h2 className="font-headline font-bold text-xl flex items-center gap-2">
              <Filter className="w-5 h-5 text-primary" />
              Filters
            </h2>
            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold">Clear All</Button>
          </div>

          <div className="space-y-6">
            {/* Search in filters */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search within results..." className="pl-10 text-sm bg-secondary border-none" />
            </div>

            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase text-xs tracking-wider text-muted-foreground">Categories</h3>
              <div className="space-y-3">
                {['Electronics', 'Fashion', 'Home & Living', 'Accessories', 'Beauty'].map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox id={cat} />
                    <label htmlFor={cat} className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {cat}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-4">
              <h3 className="font-bold uppercase text-xs tracking-wider text-muted-foreground">Price Range</h3>
              <div className="space-y-6 px-2">
                <Slider
                  defaultValue={[0, 1000]}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-6"
                />
                <div className="flex items-center justify-between gap-4">
                  <div className="bg-secondary rounded-lg p-2 flex-1 text-center font-bold text-sm">
                    ${priceRange[0]}
                  </div>
                  <span className="text-muted-foreground">-</span>
                  <div className="bg-secondary rounded-lg p-2 flex-1 text-center font-bold text-sm">
                    ${priceRange[1]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-grow">
          {/* Controls Bar */}
          <div className="bg-white dark:bg-card border border-border rounded-2xl p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-bold text-foreground">1-{staticProducts.length}</span> of {staticProducts.length} results
              </p>
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                <Button 
                  variant={viewType === 'grid' ? 'default' : 'ghost'} 
                  size="icon" 
                  className="h-8 w-8 rounded-md"
                  onClick={() => setViewType('grid')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewType === 'list' ? 'default' : 'ghost'} 
                  size="icon" 
                  className="h-8 w-8 rounded-md"
                  onClick={() => setViewType('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap hidden md:block">Sort by:</span>
              <Select defaultValue="newest">
                <SelectTrigger className="w-full sm:w-[180px] rounded-xl bg-secondary border-none">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Best Rating</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Bar */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center gap-2 hover:bg-primary/20 transition-colors">
              Electronics
              <button className="hover:text-foreground">×</button>
            </Badge>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {staticProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
