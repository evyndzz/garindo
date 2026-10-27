export interface CommodityItem {
  id: string;
  name: string;
  category: "sembako" | "bahan-bangunan" | "kebutuhan-harian";
  subCategory?: string;
  brand: string;
  tagline: string;
  description: string;
  specs: string[];
  fullSpecs?: { label: string; value: string }[];
  certification?: string;
  packagingVariants?: string[];
  leadTime?: string;
  originWarehouse?: string;
  capacityInfo: string;
  monthlyMetric: string;
  packaging: string;
  image: string;
  bentoSpan?: "large" | "medium" | "standard";
  // B2B Pricing Tiers
  unitLabel: string;
  wholesalePrice: number; // Harga Grosir Toko (Rp)
  trontonPrice: number;   // Harga Partai Tronton / Kontrak (Rp)
  minWholesale: string;
  minTronton: string;
  stockStatus: "Stok Melimpah" | "Siap Kirim 24 Jam" | "Alokasi Prioritas";
}

export interface StatMetric {
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  description: string;
  progressPercent: number;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  location: string;
  quote: string;
  partnerType: string;
  contractScope: string;
  verifiedYear: string;
}

export interface RegencyCoverage {
  name: string;
  leadTime: string;
  distanceKm: string;
  distanceRatio: number; // 0 to 100 for animated route bar
  fleetType: string;
  schedule: string;
  minOrder: string;
  corridor: "Pusat Hub" | "Koridor Barat & Utara" | "Koridor Tengah" | "Koridor Timur & Kepulauan";
}
