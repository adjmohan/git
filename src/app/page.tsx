
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, ArrowRight, Zap, ShieldCheck, Truck, RotateCcw, Phone } from 'lucide-react';
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
  return (
    <div className="flex flex-col gap-12 pb-20">
      {/* Hero Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-primary/5">
        <div className="container mx-auto px-4 h-full flex flex-col md:flex-row items-center justify-between py-12 gap-8">
          <div className="flex-1 space-y-6 text-center md:text-left animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase">
              <Zap className="w-4 h-4" />
              Limited Time Summer Offer
            </div>
            <h1 className="font-headline font-bold text-5xl md:text-7xl leading-tight">
              Elegance in <br /> Every <span className="text-primary">Stream</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Discover a curated selection of the finest products crafted just for you. Quality meets convenience at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Link href="/products">
                <Button size="lg" className="rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-primary/25">
                  Shop Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/deals">
                <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-bold">
                  View Deals
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-1 relative w-full h-64 md:h-full animate-fade-in delay-150">
            <Image
              src={PlaceHolderImages.find(img => img.id === 'hero-1')?.imageUrl || ''}
              alt="Hero Banner"
              fill
              className="object-contain"
              priority
              data-ai-hint="tech banner"
            />
          </div>
        </div>
        {/* Abstract Background Shapes */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-1/4 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl -z-10" />
      </section>

      {/* Category Grid */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-headline font-bold text-3xl">Shop by Category</h2>
          <Link href="/categories" className="text-primary font-bold flex items-center gap-1 hover:underline">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((cat) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="group flex flex-col items-center gap-4 text-center">
              <div className="relative w-full aspect-square bg-secondary rounded-3xl overflow-hidden group-hover:scale-105 transition-all duration-300 ring-primary/0 group-hover:ring-4 ring-offset-4">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover p-4"
                  data-ai-hint={cat.name}
                />
              </div>
              <span className="font-bold text-lg">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Features Bar */}
      <section className="container mx-auto px-4">
        <div className="bg-white dark:bg-card border border-border p-8 rounded-[2rem] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 text-primary rounded-2xl flex items-center justify-center">
              <Truck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Fast Delivery</h4>
              <p className="text-sm text-muted-foreground">Free for orders over $150</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Secure Payments</h4>
              <p className="text-sm text-muted-foreground">100% encryption guaranteed</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
              <RotateCcw className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-lg">Easy Returns</h4>
              <p className="text-sm text-muted-foreground">30-day hassle free policy</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
              <Phone className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-lg">24/7 Support</h4>
              <p className="text-sm text-muted-foreground">Expert help anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 bg-secondary/30 py-16 rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-headline font-bold text-4xl mb-2">Featured Products</h2>
            <p className="text-muted-foreground">Handpicked excellence for our valued customers.</p>
          </div>
          <Link href="/products?featured=true">
            <Button variant="ghost" className="font-bold text-primary">
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Deals Section */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative h-[300px] rounded-[2rem] overflow-hidden group">
            <Image
              src={PlaceHolderImages.find(img => img.id === 'hero-2')?.imageUrl || ''}
              alt="Fashion Deal"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              data-ai-hint="fashion sale"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-10 space-y-4">
              <span className="text-accent font-bold uppercase tracking-widest text-sm">Flash Sale</span>
              <h3 className="text-white font-headline font-bold text-4xl">UP TO 50% OFF <br /> FASHION</h3>
              <Button size="lg" className="w-fit rounded-full px-8">Shop Now</Button>
            </div>
          </div>
          <div className="relative h-[300px] rounded-[2rem] overflow-hidden group">
            <Image
              src={PlaceHolderImages.find(img => img.id === 'cat-electronics')?.imageUrl || ''}
              alt="Electronics Deal"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              data-ai-hint="tech sale"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-transparent flex flex-col justify-center p-10 space-y-4">
              <span className="text-accent font-bold uppercase tracking-widest text-sm">Tech Week</span>
              <h3 className="text-white font-headline font-bold text-4xl">PREMIUM GADGETS <br /> STARTING $99</h3>
              <Button size="lg" className="w-fit rounded-full px-8">Upgrade Now</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
