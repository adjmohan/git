
import Link from 'next/link';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
      <div className="relative mb-8">
        <span className="text-[10rem] font-headline font-black text-secondary leading-none">404</span>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-headline font-bold">Lost in Space</span>
        </div>
      </div>
      
      <p className="text-xl text-muted-foreground max-w-md mx-auto mb-10">
        We couldn't find the page you were looking for. It might have been moved or deleted.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button size="lg" className="rounded-full px-8 h-12">
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline" className="rounded-full px-8 h-12">
            <Search className="w-5 h-5 mr-2" />
            Browse Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
