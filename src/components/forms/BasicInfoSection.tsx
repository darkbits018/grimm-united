import React from 'react';
import { FormField } from './FormField';
import type { BasicInfo } from '../../types/form';

interface Props {
  data: BasicInfo;
  onChange: (field: keyof BasicInfo, value: string) => void;
  errors: Record<string, string>;
}

export function BasicInfoSection({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#2C2C2C] dark:text-white">Basic Information</h3>
      <FormField
        label="Name"
        type="text"
        value={data.name}
        onChange={(value) => onChange('name', value)}
        error={errors.name}
        required
      />
      <FormField
        label="Email Address"
        type="email"
        value={data.email}
        onChange={(value) => onChange('email', value)}
        error={errors.email}
        required
      />
      <FormField
        label="Instagram Handle"
        type="text"
        value={data.instagramHandle || ''}
        onChange={(value) => onChange('instagramHandle', value)}
        placeholder="@instagram (optional)"
      />
      <FormField
        label="X Handle"
        type="text"
        value={data.twitterHandle || ''}
        onChange={(value) => onChange('twitterHandle', value)}
        placeholder="@x (optional)"
      />
    </div>
  );
}