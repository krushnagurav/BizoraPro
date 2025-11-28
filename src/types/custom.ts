// 1. Common Configs
export interface ThemeConfig {
  primaryColor?: string;
  bannerUrl?: string;
  logoUrl?: string;
  font?: string;
  radius?: string;
}

export interface SeoConfig {
  metaTitle?: string;
  metaDescription?: string;
}

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  twitter?: string;
}

export interface Policies {
  privacy?: string;
  terms?: string;
  refund?: string;
}

// 2. Database Tables
export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  is_open: boolean;
  auto_close: boolean;
  opening_time?: string;
  closing_time?: string;
  whatsapp_number: string;
  theme_config: ThemeConfig;
  seo_config: SeoConfig;
  social_links: SocialLinks;
  policies: Policies;
  product_limit: number;
  plan: 'free' | 'pro';
}

export interface Product {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  sale_price?: number | null;
  image_url?: string;
  description?: string;
  status: 'active' | 'draft' | 'archived';
  variants?: any[];
  gallery_images?: string[];
  badges?: string[];
  // Joins
  categories?: { name: string };
}