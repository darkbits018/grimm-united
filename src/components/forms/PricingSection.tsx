import React from 'react';
import { Select } from './Select';
import type { PricingPreferences } from '../../types/form';

const PRICE_RANGES = [
  '₹799–₹999',
  '₹999–₹1499',
  '₹1499+',
];

interface Props {
  data: PricingPreferences;
  onChange: (field: keyof PricingPreferences, value: string) => void;
  errors: Record<string, string>;
}

export function PricingSection({ data, onChange, errors }: Props) {
  // pre-select first option if nothing chosen yet
  const value = data.priceRange || PRICE_RANGES[0];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#2C2C2C] dark:text-white">Pricing Preferences</h3>
      <Select
        label="What price range works for you?"
        value={value}
        options={PRICE_RANGES}
        onChange={(v) => onChange('priceRange', v[0])}
        error={errors.priceRange}
        required
      />
    </div>
  );
}