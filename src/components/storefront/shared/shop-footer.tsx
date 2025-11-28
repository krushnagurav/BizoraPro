import Link from "next/link";
import { Store, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export function ShopFooter({ shop }: { shop: any }) {
  const social = shop.social_links || {};

  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 font-bold text-xl text-primary">
              <Store className="w-6 h-6" />
              {shop.name}
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your trusted destination for quality products. We are committed to
              providing the best service to our customers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Shop</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link
                  href={`/${shop.slug}`}
                  className="hover:text-primary transition"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href={`/${shop.slug}/about`}
                  className="hover:text-primary transition"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href={`/${shop.slug}/contact`}
                  className="hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href={`/${shop.slug}/legal`}
                  className="hover:text-primary transition-colors"
                >
                  Store Policies
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="font-bold text-white">Follow Us</h4>
            <div className="flex gap-3">
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-black transition"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-black transition"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-black transition"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  className="bg-white/10 p-2 rounded-full hover:bg-primary hover:text-black transition"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {shop.name}. All rights reserved.
          </p>
          {shop.plan === "free" && (
            <p>
              Powered by{" "}
              <a
                href="https://bizorapro.com"
                target="_blank"
                className="text-slate-300 font-medium hover:underline"
              >
                BizoraPro
              </a>
            </p>
          )}{" "}
        </div>
      </div>
    </footer>
  );
}
