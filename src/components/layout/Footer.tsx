import React from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#172337] text-white pt-10 pb-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 text-xs">
          <div className="space-y-3">
            <h4 className="text-gray-400 font-medium uppercase">About</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Contact Us</Link></li>
              <li><Link href="#" className="hover:underline">About Us</Link></li>
              <li><Link href="#" className="hover:underline">Careers</Link></li>
              <li><Link href="#" className="hover:underline">Flipkart Stories</Link></li>
              <li><Link href="#" className="hover:underline">Press</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-gray-400 font-medium uppercase">Help</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Payments</Link></li>
              <li><Link href="#" className="hover:underline">Shipping</Link></li>
              <li><Link href="#" className="hover:underline">Cancellation & Returns</Link></li>
              <li><Link href="#" className="hover:underline">FAQ</Link></li>
              <li><Link href="#" className="hover:underline">Report Infringement</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-gray-400 font-medium uppercase">Policy</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Return Policy</Link></li>
              <li><Link href="#" className="hover:underline">Terms Of Use</Link></li>
              <li><Link href="#" className="hover:underline">Security</Link></li>
              <li><Link href="#" className="hover:underline">Privacy</Link></li>
              <li><Link href="#" className="hover:underline">Sitemap</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-gray-400 font-medium uppercase">Social</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="hover:underline">Facebook</Link></li>
              <li><Link href="#" className="hover:underline">Twitter</Link></li>
              <li><Link href="#" className="hover:underline">YouTube</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2 border-l border-gray-600 pl-8 hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-gray-400 font-medium uppercase">Mail Us:</h4>
                <p className="text-gray-300">
                  Flipkart Internet Private Limited,<br />
                  Buildings Alyssa, Begonia &<br />
                  Clove Embassy Tech Village,<br />
                  Outer Ring Road, Devarabeesanahalli Village,<br />
                  Bengaluru, 560103,<br />
                  Karnataka, India
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="text-gray-400 font-medium uppercase">Registered Office Address:</h4>
                <p className="text-gray-300">
                  Flipkart Internet Private Limited,<br />
                  Buildings Alyssa, Begonia &<br />
                  Clove Embassy Tech Village,<br />
                  Outer Ring Road, Devarabeesanahalli Village,<br />
                  Bengaluru, 560103,<br />
                  Karnataka, India<br />
                  CIN : U51109KA2012PTC066107<br />
                  Telephone: 044-45614700
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <div className="flex flex-wrap justify-center gap-6">
            <span className="flex items-center gap-1 text-accent"><MapPin className="w-3 h-3" /> Become a Seller</span>
            <span className="flex items-center gap-1 text-accent"><Twitter className="w-3 h-3" /> Advertise</span>
            <span className="flex items-center gap-1 text-accent"><Facebook className="w-3 h-3" /> Gift Cards</span>
            <span className="flex items-center gap-1 text-accent"><Mail className="w-3 h-3" /> Help Center</span>
          </div>
          <p className="text-gray-400">© 2007-2024 Flipkart.com</p>
          <div className="flex gap-4">
            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c454fb.svg" alt="Payment methods" className="h-4" />
          </div>
        </div>
      </div>
    </footer>
  );
};