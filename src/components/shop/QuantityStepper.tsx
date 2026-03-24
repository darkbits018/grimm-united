import { Minus, Plus } from 'lucide-react';

interface Props {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
}

export function QuantityStepper({ value, onChange, min = 1, max = 99 }: Props) {
  return (
    <div className="flex items-center border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden w-fit">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Minus className="w-4 h-4 dark:text-gray-300" />
      </button>
      <span className="px-4 py-2 font-semibold dark:text-white min-w-[2.5rem] text-center">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4 dark:text-gray-300" />
      </button>
    </div>
  );
}
