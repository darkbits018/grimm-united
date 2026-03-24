type Status = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

const styles: Record<Status, string> = {
  pending:   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  paid:      'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  shipped:   'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export function OrderStatusBadge({ status }: { status: Status }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status]}`}>
      {status}
    </span>
  );
}
