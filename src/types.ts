export type GoldPurity = '24K' | '22K' | '18K' | '14K';

export interface GoldCalculationResult {
  purity: GoldPurity;
  weightGrams: number;
  marketRatePerGram: number; // reference rate
  payoutValue: number;
  commissionRate: number; // e.g., 2% service charge
}

export type CourseType = 'appetizers' | 'mains' | 'desserts' | 'beverages';

export interface MenuItem {
  id: string;
  name: string;
  category: CourseType;
  pricePerPerson: number;
  description: string;
}

export interface CateringEstimate {
  selectedItems: string[]; // item ids
  guestCount: number;
  totalPerGuest: number;
  totalEstimate: number;
  eventDurationHours: number;
  setupCharge: number;
}

export type PropertyType = 'Commercial' | 'Residential Sale' | 'Residential Rental' | 'Plot / Land';

export interface PropertyListing {
  id: string;
  title: string;
  type: PropertyType;
  price: string;
  priceNum: number;
  location: string;
  bedrooms?: number;
  bathrooms?: number;
  area: string; // e.g., 1200 Sq.Ft
  image: string;
  featured: boolean;
  tag: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessSection: 'gold' | 'catering' | 'real_estate' | 'general';
  message: string;
  date: string;
  syncedToSheets?: boolean;
  status?: 'new' | 'contacted' | 'processed' | 'declined';
  adminNotes?: string;
}
