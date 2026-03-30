import React from 'react';
import { TextArea } from '../ui/TextArea';
import type { Feedback } from '../../types/form';

interface Props {
  data: Feedback;
  onChange: (field: keyof Feedback, value: string) => void;
  errors: Record<string, string>;
}

export function FeedbackSection({ data, onChange, errors }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#2C2C2C] dark:text-white">
        Feedback
      </h3>
      <TextArea
        label="What kind of designs or themes would you like to see?"
        value={data.designSuggestions}
        onChange={(e) => onChange('designSuggestions', e.target.value)}
        error={errors.designSuggestions}
        required
        rows={3}
      />
    </div>
  );
}