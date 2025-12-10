// src/components/storefront/shared/shop-footer.tsx
/*  * Shop Footer Component
 * This component renders the footer for the storefront,
 * including shop information, navigation links, social media
 * icons, and legal policy links.
 */
import Link from "next/link";
import { Instagram, Facebook, Youtube, Twitter } from "lucide-react";

export function ShopFooter({ shop }: { shop: any }) {
  const social = shop.social_links || {};
  const policies = shop.policies || {};

  return (
    <footer className="bg-slate-900 text-slate-200 mt-16 pt-12 pb-6">
      <div className="container mx-auto px-6 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2 space-y-3">
          <p className="text-lg font-bold text-white">{shop.name}</p>
          <p className="text-sm text-slate-400 max-w-md">
            Your trusted destination for quality products and a smooth WhatsApp
            shopping experience.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-white">Shop</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            <Link href={`/${shop.slug}`}>All Products</Link>
            <Link href={`/${shop.slug}/about`}>About Us</Link>
            <Link href={`/${shop.slug}/contact`}>Contact</Link>
            <Link href={`/${shop.slug}/legal`}>Store Policies</Link>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-sm mb-3 text-white">Support</h4>
          <div className="flex flex-col gap-2 text-sm text-slate-400">
            {policies.refund && (
              <Link href={`/${shop.slug}/legal#refund`}>Refund Policy</Link>
            )}
            {policies.privacy && (
              <Link href={`/${shop.slug}/legal#privacy`}>Privacy Policy</Link>
            )}
            {policies.terms && (
              <Link href={`/${shop.slug}/legal#terms`}>
                Terms &amp; Conditions
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 mt-8 pt-4 border-t border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-3">
          <span>
            © {new Date().getFullYear()} {shop.name}. All rights reserved.
          </span>
          <div className="flex gap-2">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noreferrer">
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {social.youtube && (
              <a href={social.youtube} target="_blank" rel="noreferrer">
                <Youtube className="h-4 w-4" />
              </a>
            )}
            {social.twitter && (
              <a href={social.twitter} target="_blank" rel="noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {shop.plan === "free" && (
          <p>
            Powered by{" "}
            <Link
              href="https://bizorapro.com"
              target="_blank"
              className="text-[hsl(var(--primary))] hover:underline"
            >
              BizoraPro
            </Link>
          </p>
        )}
      </div>
    </footer>
  );
}
