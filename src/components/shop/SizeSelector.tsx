interface Props {
  sizes: string[];
  stockPerSize: Record<string, number>;
  selected: string;
  onChange: (size: string) => void;
}

export function SizeSelector({ sizes, stockPerSize, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {sizes.map(size => {
        // -1 = explicitly out of stock, 0 or missing = in stock (Qikink on-demand fulfillment)
        const inStock = (stockPerSize[size] ?? 0) !== -1;
        return (
          <button
            key={size}
            onClick={() => inStock && onChange(size)}
            disabled={!inStock}
            className={`w-12 h-12 rounded-xl border-2 text-sm font-semibold transition-all
              ${selected === size
                ? 'border-[#FF4B8C] bg-[#FF4B8C] text-white'
                : inStock
                  ? 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#FF4B8C]'
                  : 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed line-through'
              }`}
          >
            {size}
          </button>
        );
      })}
    </div>
  );
}
