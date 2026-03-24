import { X } from 'lucide-react';

interface Props { onClose: () => void; }

const sizeData = [
  { size: 'XS', chest: '34-36', waist: '28-30', length: '27' },
  { size: 'S',  chest: '36-38', waist: '30-32', length: '28' },
  { size: 'M',  chest: '38-40', waist: '32-34', length: '29' },
  { size: 'L',  chest: '40-42', waist: '34-36', length: '30' },
  { size: 'XL', chest: '42-44', waist: '36-38', length: '31' },
  { size: 'XXL',chest: '44-46', waist: '38-40', length: '32' },
];

export function SizeGuideModal({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#1E1E1E] rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg dark:text-white">Size Guide (inches)</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
            <X className="w-5 h-5 dark:text-gray-400" />
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-gray-500 text-xs uppercase">
              <th className="px-3 py-2 text-left">Size</th>
              <th className="px-3 py-2 text-left">Chest</th>
              <th className="px-3 py-2 text-left">Waist</th>
              <th className="px-3 py-2 text-left">Length</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {sizeData.map(row => (
              <tr key={row.size} className="dark:text-gray-300">
                <td className="px-3 py-2 font-semibold">{row.size}</td>
                <td className="px-3 py-2">{row.chest}</td>
                <td className="px-3 py-2">{row.waist}</td>
                <td className="px-3 py-2">{row.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-gray-400 mt-4">All measurements are in inches. If between sizes, size up.</p>
      </div>
    </div>
  );
}
