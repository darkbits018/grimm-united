interface Props {
  price: number;
  compareAt?: number;
  className?: string;
}

export function PriceDisplay({ price, compareAt, className = '' }: Props) {
  const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;
  return (
    <span className={`flex items-center gap-2 ${className}`}>
      <span className="font-bold text-[#FF4B8C]">{fmt(price)}</span>
      {compareAt && compareAt > price && (
        <span className="text-gray-400 line-through text-sm">{fmt(compareAt)}</span>
      )}
    </span>
  );
}
