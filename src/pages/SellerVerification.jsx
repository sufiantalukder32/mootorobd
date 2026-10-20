import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary';

export default function SellerVerification() {
  const [submitted, setSubmitted] = useState(null);
  const [bankFile, setBankFile] = useState('');
  const [walletFile, setWalletFile] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => {
    setSubmitted({ ...values, bankFile, walletFile });
  };

  if (submitted) {
    return (
      <section className="mx-auto max-w-xl px-4 py-12">
        <div className="card">
          <h1 className="text-2xl font-bold">Verification started</h1>
          <p className="mt-3 text-sm text-slate-700">
            {submitted.businessName} in {submitted.location} is queued as a demo listing at ৳
            {Number(submitted.askingPrice || 0).toLocaleString('en-IN')}. No documents were uploaded.
          </p>
          <Link to="/seller/dashboard" className="btn-primary mt-6 inline-block">
            Open seller dashboard
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4">
        <h1 className="text-2xl font-bold">Verify your business</h1>
        <p className="text-sm text-slate-600">
          Tell us what you want to sell. File fields stay on this device.
        </p>

        <label className="block text-sm">
          Business name
          <input className={`${inputClass} mt-1`} {...register('businessName', { required: 'Business name is required' })} />
          {errors.businessName && <span className="text-error">{errors.businessName.message}</span>}
        </label>

        <label className="block text-sm">
          Category
          <select className={`${inputClass} mt-1`} defaultValue="" {...register('category', { required: 'Select a category' })}>
            <option value="" disabled>
              Select category
            </option>
            {['Agriculture', 'Retail', 'Food & Beverage', 'Pharmacy', 'Electronics', 'Services', 'Other'].map(
              (category) => (
                <option key={category}>{category}</option>
              )
            )}
          </select>
          {errors.category && <span className="text-error">{errors.category.message}</span>}
        </label>

        <label className="block text-sm">
          Location
          <input className={`${inputClass} mt-1`} {...register('location', { required: 'Location is required' })} />
          {errors.location && <span className="text-error">{errors.location.message}</span>}
        </label>

        <label className="block text-sm">
          Asking price (taka)
          <input
            type="number"
            className={`${inputClass} mt-1`}
            {...register('askingPrice', { required: 'Asking price is required', min: { value: 1, message: 'Enter a price' } })}
          />
          {errors.askingPrice && <span className="text-error">{errors.askingPrice.message}</span>}
        </label>

        <label className="block text-sm">
          Estimated annual revenue (taka)
          <input
            type="number"
            className={`${inputClass} mt-1`}
            {...register('revenue', { required: 'Estimated revenue is required', min: { value: 1, message: 'Enter revenue' } })}
          />
          {errors.revenue && <span className="text-error">{errors.revenue.message}</span>}
        </label>

        <label className="block text-sm">
          Bank statement upload
          <input
            type="file"
            accept="image/*,.pdf"
            className="mt-1 block w-full text-sm"
            onChange={(event) => setBankFile(event.target.files?.[0]?.name || '')}
          />
        </label>

        <label className="block text-sm">
          Online banking screenshot
          <input
            type="file"
            accept="image/*"
            className="mt-1 block w-full text-sm"
            onChange={(event) => setWalletFile(event.target.files?.[0]?.name || '')}
          />
        </label>

        <button type="submit" className="btn-primary w-full">
          VERIFY BUSINESS
        </button>
      </form>
    </section>
  );
}
