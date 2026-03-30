import type { BuyingIntent } from '../../types/form';

const OPTIONS: { value: BuyingIntent; label: string; emoji: string; sub: string }[] = [
  { value: 'definitely', label: 'Definitely Buying', emoji: '🔥', sub: 'I\'m in on day one' },
  { value: 'might',      label: 'Might Buy',         emoji: '🤔', sub: 'Depends on the designs' },
  { value: 'exploring',  label: 'Just Exploring',    emoji: '👀', sub: 'Checking things out' },
];

interface Props {
  value: BuyingIntent;
  onChange: (value: BuyingIntent) => void;
  error?: string;
}

export function BuyingIntentSection({ value, onChange, error }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-[#2C2C2C] dark:text-white">
        How likely are you to buy when we launch?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {OPTIONS.map(opt => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex flex-col items-center gap-1 p-4 rounded-xl border-2 transition-all text-center ${
              value === opt.value
                ? 'border-[#FF4B8C] bg-[#FF4B8C]/10 text-[#FF4B8C]'
                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#FF4B8C]/40'
            }`}
          >
            <span className="text-2xl">{opt.emoji}</span>
            <span className="font-semibold text-sm">{opt.label}</span>
            <span className="text-xs opacity-70">{opt.sub}</span>
          </button>
        ))}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
