const labels = {
  bank: 'Bank statement verified',
  'online-banking': 'Online banking verified',
  supplier: 'Supplier records verified',
};

export default function VerificationBadge({ type = 'bank', status = 'verified' }) {
  const verified = status === 'verified';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${
        verified ? 'bg-green-100 text-green-800' : 'bg-slate-200 text-slate-600'
      }`}
    >
      <span aria-hidden="true">{verified ? '✓' : '•'}</span>
      {verified ? labels[type] || 'Verified' : `${labels[type] || 'Check'} pending`}
    </span>
  );
}
