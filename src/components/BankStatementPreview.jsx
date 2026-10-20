import { useState } from 'react';
import { formatPrice } from '../utils/helpers';

export default function BankStatementPreview({ bankStatement }) {
  const [notice, setNotice] = useState('');
  const months = bankStatement?.last6Months || [];
  const maxValue = Math.max(
    1,
    ...months.map((month) => Math.max(month.inflow, month.outflow))
  );

  return (
    <section className="card">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">Bank statement</h3>
          <p className="text-sm text-slate-600">
            {bankStatement?.bank} · {bankStatement?.accountHolder}
          </p>
        </div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            setNotice('Demo only — a PDF is not generated from this preview.')
          }
        >
          Download PDF
        </button>
      </div>
      {notice && <p className="mb-3 text-sm text-slate-600">{notice}</p>}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b text-slate-500">
              <th className="py-2 pr-3 font-medium">Month</th>
              <th className="py-2 pr-3 font-medium">Inflow</th>
              <th className="py-2 pr-3 font-medium">Outflow</th>
              <th className="py-2 font-medium">Balance</th>
            </tr>
          </thead>
          <tbody>
            {months.map((month) => (
              <tr key={month.month} className="border-b border-slate-100">
                <td className="py-2 pr-3">{month.month}</td>
                <td className="py-2 pr-3 text-secondary">{formatPrice(month.inflow)}</td>
                <td className="py-2 pr-3 text-error">{formatPrice(month.outflow)}</td>
                <td className="py-2 font-medium">{formatPrice(month.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-secondary" /> Inflow
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-sm bg-error" /> Outflow
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {months.map((month) => (
            <div key={month.month} className="flex flex-col items-center gap-1">
              <div className="flex h-28 items-end gap-1">
                <div
                  className="w-3 rounded-t bg-secondary"
                  style={{ height: `${(month.inflow / maxValue) * 100}%` }}
                  title={`Inflow ${formatPrice(month.inflow)}`}
                />
                <div
                  className="w-3 rounded-t bg-error"
                  style={{ height: `${(month.outflow / maxValue) * 100}%` }}
                  title={`Outflow ${formatPrice(month.outflow)}`}
                />
              </div>
              <span className="text-center text-[11px] text-slate-500">{month.month.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
