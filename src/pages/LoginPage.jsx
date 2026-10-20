import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { mockLogin } from '../utils/auth';
import mockBuyers from '../data/mockBuyers';

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (values) => {
    const result = mockLogin(values.email, values.password);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    navigate('/buyer/dashboard');
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4" noValidate>
        <h1 className="text-2xl font-bold">Log in</h1>
        <p className="text-sm text-slate-600">Use a demo buyer account to open full financials.</p>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Email</span>
          <input
            type="email"
            className={inputClass}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <span className="text-error">{errors.email.message}</span>}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Password</span>
          <input
            type="password"
            className={inputClass}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          {errors.password && <span className="text-error">{errors.password.message}</span>}
        </label>

        {formError && <p className="text-sm text-error">{formError}</p>}

        <button type="submit" className="btn-primary w-full" disabled={isSubmitting}>
          Log In
        </button>
        <p className="text-sm">
          Don&apos;t have account?{' '}
          <Link to="/signup" className="font-semibold text-primary">
            Sign up
          </Link>
        </p>
      </form>

      <aside className="card">
        <h2 className="font-semibold">Demo accounts</h2>
        <p className="mt-1 text-sm text-slate-600">Password for every account is demo123.</p>
        <ul className="mt-4 space-y-2">
          {mockBuyers.map((buyer) => (
            <li key={buyer.id}>
              <button
                type="button"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm hover:border-primary"
                onClick={() => {
                  setValue('email', buyer.email, { shouldValidate: true });
                  setValue('password', buyer.password, { shouldValidate: true });
                  setFormError('');
                }}
              >
                <span className="font-medium">{buyer.name}</span>
                <span className="block text-slate-500">
                  {buyer.email} · {buyer.sector}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
