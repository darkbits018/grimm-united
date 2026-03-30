export interface BasicInfo {
  name: string;
  email: string;
  instagramHandle?: string;
  twitterHandle?: string; 
}

export interface StylePreferences {
  styles: string[];
  otherStyles: string;
}

export interface ClothingTypes {
  types: string[];
}

export interface PricingPreferences {
  priceRange: string;
}

export interface Feedback {
  designSuggestions: string;
  generalFeedback: string;
}

export interface Consent {
  cashbackConsent: boolean;
  subscribeUpdates: boolean;
}

export type BuyingIntent = 'definitely' | 'might' | 'exploring' | '';

export interface FormData {
  basicInfo: BasicInfo;
  stylePreferences: StylePreferences;
  clothingTypes: ClothingTypes;
  pricingPreferences: PricingPreferences;
  feedback: Feedback;
  consent: Consent;
  buyingIntent: BuyingIntent;
}