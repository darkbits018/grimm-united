import React from 'react';
import { Checkbox } from './Checkbox';
import type { Consent } from '../../types/form';

interface Props {
  data: Consent;
  onChange: (field: keyof Consent, value: boolean) => void;
  errors: Record<string, string>;
}

export function ConsentSection({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <Checkbox
        label="I want flat ₹100 off on launch — apply it to my first order."
        checked={data.cashbackConsent}
        onChange={(checked) => onChange('cashbackConsent', checked)}
      />
      
      <Checkbox
        label="I'd like to receive updates about the store launch and exclusive offers."
        checked={data.subscribeUpdates}
        onChange={(checked) => onChange('subscribeUpdates', checked)}
      />
      
      {errors.consent && (
        <p className="text-red-500 text-sm">{errors.consent}</p>
      )}
    </div>
  );
}