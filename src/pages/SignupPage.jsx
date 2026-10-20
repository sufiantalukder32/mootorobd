import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { mockSignup } from '../utils/auth';

const inputClass =
  'w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formError, setFormError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (values) => {
    const result = mockSignup(values);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    navigate('/buyer/dashboard');
  };

  return (
    <section className="mx-auto max-w-xl px-4 py-10">
      <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4" noValidate>
        <h1 className="text-2xl font-bold">Create a buyer account</h1>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Full name</span>
          <input
            className={inputClass}
            {...register('fullName', {
              required: 'Full name is required',
              minLength: { value: 2, message: 'Enter your full name' },
            })}
          />
          {errors.fullName && <span className="text-error">{errors.fullName.message}</span>}
        </label>

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

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Phone</span>
          <input
            className={inputClass}
            placeholder="01XXXXXXXXX"
            {...register('phone', {
              required: 'Phone is required',
              minLength: { value: 10, message: 'Enter a valid phone number' },
            })}
          />
          {errors.phone && <span className="text-error">{errors.phone.message}</span>}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Budget</span>
          <select
            className={inputClass}
            defaultValue=""
            {...register('budget', { required: 'Select a budget' })}
          >
            <option value="" disabled>
              Select budget
            </option>
            <option value="100000-500000">৳1-5 লাখ</option>
            <option value="500000-2000000">৳5-20 লাখ</option>
            <option value="2000000-10000000">৳20+ লাখ</option>
          </select>
          {errors.budget && <span className="text-error">{errors.budget.message}</span>}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Sector</span>
          <select
            className={inputClass}
            defaultValue=""
            {...register('sector', { required: 'Select a sector' })}
          >
            <option value="" disabled>
              Select sector
            </option>
            {['Agriculture', 'Retail', 'Food & Beverage', 'Pharmacy', 'Electronics', 'Services', 'Other'].map(
              (sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              )
            )}
          </select>
          {errors.sector && <span className="text-error">{errors.sector.message}</span>}
        </label>

        <label className="block text-sm">
          <span className="mb-1 block font-medium">Experience</span>
          <select
            className={inputClass}
            defaultValue=""
            {...register('experience', { required: 'Select your experience' })}
          >
            <option value="" disabled>
              Select experience
            </option>
            <option value="first-time">First-time</option>
            <option value="some">Some experience</option>
            <option value="experienced">Experienced</option>
          </select>
          {errors.experience && <span className="text-error">{errors.experience.message}</span>}
        </label>

        {formError && <p className="text-sm text-error">{formError}</p>}

        <button type="submit" className="btn-primary w-full">
          Sign Up
        </button>
        <p className="text-sm">
          Already have account?{' '}
          <Link to="/login" className="font-semibold text-primary">
            Login
          </Link>
        </p>
      </form>
    </section>
  );
}
