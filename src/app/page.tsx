
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Truck, ShieldCheck, RotateCcw, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/product/ProductCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Product, Category } from '@/types';

// Mock data for initial render
const categories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics', image: PlaceHolderImages.find(img => img.id === 'cat-electronics')?.imageUrl || '' },
  { id: '2', name: 'Fashion', slug: 'fashion', image: PlaceHolderImages.find(img => img.id === 'cat-fashion')?.imageUrl || '' },
  { id: '3', name: 'Home & Living', slug: 'home', image: PlaceHolderImages.find(img => img.id === 'cat-home')?.imageUrl || '' },
  { id: '4', name: 'Accessories', slug: 'accessories', image: PlaceHolderImages.find(img => img.id === 'cat-fashion')?.imageUrl || '' },
  { id: '5', name: 'Mobile', slug: 'mobiles', image: PlaceHolderImages.find(img => img.id === 'cat-electronics')?.imageUrl || '' },
  { id: '6', name: 'Appliances', slug: 'appliances', image: PlaceHolderImages.find(img => img.id === 'cat-home')?.imageUrl || '' },
];

const featuredProducts: Product[] = [
  {
    id: 'p1',
    name: 'Ultra Slim Smartphone Pro',
    description: 'The best smartphone with 120Hz display and advanced camera.',
    price: 999,
    originalPrice: 1199,
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 1240,
    image: PlaceHolderImages.find(img => img.id === 'product-1')?.imageUrl || '',
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p2',
    name: 'Acoustic Master Wireless Headphones',
    description: 'Noise cancelling premium headphones with 40h battery life.',
    price: 299,
    originalPrice: 349,
    category: 'Electronics',
    rating: 4.6,
    reviewCount: 850,
    image: PlaceHolderImages.find(img => img.id === 'product-2')?.imageUrl || '',
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p3',
    name: 'Smart Watch X-Series v7',
    description: 'Advanced health monitoring and sleek design.',
    price: 199,
    originalPrice: 249,
    category: 'Electronics',
    rating: 4.7,
    reviewCount: 620,
    image: PlaceHolderImages.find(img => img.id === 'product-3')?.imageUrl || '',
    thumbnails: [],
    inStock: true,
    specifications: {}
  },
  {
    id: 'p4',
    name: 'Luxury Cotton Basics T-Shirt',
    description: 'Soft, breathable premium cotton essentials.',
    price: 29,
    category: 'Fashion',
    rating: 4.5,
    reviewCount: 2100,
    image: PlaceHolderImages.find(img => img.id === 'product-4')?.imageUrl || '',
    thumbnails: [],
    inStock: true,
    specifications: {}
  }
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-1')?.imageUrl;

  return (
    <div className="flex flex-col gap-8 pb-20 bg-gray-100">
      {/* Hero Banner Section */}
      <section className="relative w-full h-[300px] overflow-hidden">
        {heroImage && (
          <Image
            src={heroImage}
            alt="Flipkart Sale"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-black/10 flex items-center px-10">
          <div className="max-w-lg text-white space-y-4">
             <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg text-white">Big Billion Days</h1>
             <p className="text-xl drop-shadow-md text-white">Biggest Offers of the Year!</p>
             <Link href="/products">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white font-bold rounded-sm px-8">
                  Shop Now
                </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* Category Icons Bar */}
      <section className="bg-white py-4 shadow-sm overflow-x-auto whitespace-nowrap">
        <div className="container mx-auto px-4 flex justify-between gap-8 min-w-max">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="flex flex-col items-center gap-2 group">
              <div className="relative w-16 h-16 rounded-full overflow-hidden transition-transform group-hover:scale-110 bg-gray-50">
                {cat.image && (
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <span className="text-sm font-bold text-gray-700">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid Section */}
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Left Sidebar Ad */}
        <div className="hidden md:block bg-white p-4 rounded shadow-sm h-fit space-y-4">
          <h3 className="font-bold border-b pb-2">Deals of the Day</h3>
          <div className="space-y-4">
            <div className="text-center group cursor-pointer">
              <div className="relative aspect-square mb-2 overflow-hidden bg-gray-50 rounded">
                {featuredProducts[0].image && (
                   <Image src={featuredProducts[0].image} alt="deal" fill className="object-contain group-hover:scale-105 transition-transform" />
                )}
              </div>
              <p className="text-sm font-medium">Smartphones</p>
              <p className="text-primary font-bold">Extra 10% Off</p>
            </div>
          </div>
        </div>

        {/* Center Products Grid */}
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white p-6 rounded shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Best of Electronics</h2>
              <Link href="/products">
                <Button className="bg-primary hover:bg-primary/90 rounded-sm">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Features Bar */}
          <div className="bg-white p-6 rounded shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-bold text-sm">Free Delivery</h4>
                <p className="text-[10px] text-muted-foreground">Orders above ₹499</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-bold text-sm">Safe Payments</h4>
                <p className="text-[10px] text-muted-foreground">100% Secure Transaction</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-bold text-sm">Easy Returns</h4>
                <p className="text-[10px] text-muted-foreground">Hassle-free 10 day policy</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-8 h-8 text-primary" />
              <div>
                <h4 className="font-bold text-sm">24/7 Support</h4>
                <p className="text-[10px] text-muted-foreground">Always here to help</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
