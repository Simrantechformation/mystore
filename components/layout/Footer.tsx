import {
    Facebook,
    Instagram,
    Pinterest,
    Tiktok,
  } from 'lucide-react';
  import Image from 'next/image';
  import Link from 'next/link';
  
  export default function Footer() {
    return (
      <footer className="bg-gray-700 text-white py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
  
          {/* Brand & Social */}
          <div>
            <h2 className="text-xl font-bold mb-2">MyStore</h2>
            <p className="text-sm mb-4">
              Socially and environmentally<br />
              progressive outdoor footwear
            </p>
            {/* <div className="flex gap-3">
              <Link href="#" aria-label="Facebook"><Facebook size={20} /></Link>
              <Link href="#" aria-label="Instagram"><Instagram size={20} /></Link>
              <Link href="#" aria-label="TikTok"><Tiktok size={20} /></Link>
              <Link href="#" aria-label="Pinterest"><Pinterest size={20} /></Link>
            </div> */}
          </div>
  
          {/* Our Shop */}
          <div>
            <h3 className="font-semibold mb-3">Our Shop</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {['All Products', 'The Weekend Boot™', 'The Anyday Rain Boot™', 'The Modern Winter Boot™', 'The Winter Weekend Boot Z™', 'The Terrus™ Clog', 'Accessories', 'Thesus™ Gift Card'].map((item, idx) => (
                <li key={idx}><Link href="#" className="hover:underline">{item}</Link></li>
              ))}
            </ul>
          </div>
  
          {/* Help */}
          <div>
            <h3 className="font-semibold mb-3">Help</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {['Size guide', 'Shipping Policy', 'Refund Policy', 'Wear and Care FAQ'].map((item, idx) => (
                <li key={idx}><Link href="#" className="hover:underline">{item}</Link></li>
              ))}
            </ul>
          </div>
  
          {/* About */}
          <div>
            <h3 className="font-semibold mb-3">About us</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {['Values', 'Contact Us'].map((item, idx) => (
                <li key={idx}><Link href="#" className="hover:underline">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>
  
        {/* Bottom Bar */}
        <div className="border-t border-gray-600 mt-10 pt-6 text-sm text-gray-400 text-center space-y-4">
          {/* Legal text */}
          <p>
            © 2025, MyStore Outdoors. All rights reserved ·&nbsp;
            <Link href="#" className="hover:underline">Refund policy</Link> ·&nbsp;
            <Link href="#" className="hover:underline">Privacy policy</Link> ·&nbsp;
            <Link href="#" className="hover:underline">Terms of service</Link> ·&nbsp;
            <Link href="#" className="hover:underline">Shipping policy</Link> ·&nbsp;
            <Link href="#" className="hover:underline">Contact information</Link>
          </p>
        </div>
      </footer>
    );
  }
  