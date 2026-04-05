<<<<<<< HEAD
import { FormEvent, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Calendar,
  CreditCard,
  DollarSign,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  ApiError,
  AuthResponse,
  Subscription,
  createSubscription,
  deleteSubscription,
  fetchSubscriptions,
  loginUser,
  signupUser,
} from './lib/api';

type AuthMode = 'login' | 'signup';

const EMPTY_FORM = {
  appName: '',
  cost: '',
  category: 'Entertainment',
  renewalDate: '',
};

const CATEGORIES = [
  'Entertainment',
  'Music',
  'Productivity',
  'Cloud',
  'Gaming',
  'Education',
  'Utilities',
  'Other',
];

export default function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('subtrack-token'));
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('subtrack-user-name') ?? '');
  const [authLoading, setAuthLoading] = useState(false);
  const [subscriptionsLoading, setSubscriptionsLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [error, setError] = useState('');
  const [authForm, setAuthForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [subscriptionForm, setSubscriptionForm] = useState(EMPTY_FORM);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const totalMonthlyCost = useMemo(
    () => subscriptions.reduce((sum, item) => sum + item.cost, 0),
    [subscriptions],
  );

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadSubscriptions = async () => {
      setSubscriptionsLoading(true);
      setError('');

      try {
        const data = await fetchSubscriptions(token);
        setSubscriptions(data);
      } catch (err) {
        const message = err instanceof ApiError ? err.message : 'Failed to load subscriptions.';
        setError(message);

        if (err instanceof ApiError && err.status === 401) {
          handleLogout();
        }
      } finally {
        setSubscriptionsLoading(false);
      }
    };

    void loadSubscriptions();
  }, [token]);

  const handleAuthSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthLoading(true);
    setError('');

    try {
      const response: AuthResponse =
        authMode === 'login'
          ? await loginUser(authForm.email, authForm.password)
          : await signupUser(authForm.name, authForm.email, authForm.password);

      persistSession(response);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Authentication failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateSubscription = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token) {
      setError('Please log in again.');
      return;
    }

    setCreateLoading(true);
    setError('');

    try {
      const created = await createSubscription(token, {
        appName: subscriptionForm.appName.trim(),
        cost: Number(subscriptionForm.cost),
        category: subscriptionForm.category,
        renewalDate: subscriptionForm.renewalDate,
      });

      setSubscriptions((current) =>
        [...current, created].sort(
          (left, right) => new Date(left.renewalDate).getTime() - new Date(right.renewalDate).getTime(),
        ),
      );
      setSubscriptionForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to create subscription.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    if (!token) {
      return;
    }

    setError('');

    try {
      await deleteSubscription(token, subscriptionId);
      setSubscriptions((current) => current.filter((item) => item._id !== subscriptionId));
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to delete subscription.');
    }
  };

  const persistSession = (response: AuthResponse) => {
    setToken(response.token);
    setUserName(response.user.name);
    localStorage.setItem('subtrack-token', response.token);
    localStorage.setItem('subtrack-user-name', response.user.name);
    setAuthForm({ name: '', email: '', password: '' });
  };

  const handleLogout = () => {
    setToken(null);
    setUserName('');
    setSubscriptions([]);
    localStorage.removeItem('subtrack-token');
    localStorage.removeItem('subtrack-user-name');
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-10 text-slate-50">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row">
          <section className="flex-1 rounded-[2rem] border border-white/10 bg-gradient-to-br from-sky-500 via-cyan-500 to-emerald-400 p-8 text-slate-950 shadow-2xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-semibold">
              <ShieldCheck className="h-4 w-4" />
              Subscription Tracker
            </p>
            <h1 className="mt-6 text-4xl font-bold leading-tight">Track every recurring payment in one place.</h1>
            <p className="mt-4 max-w-xl text-base text-slate-900/80">
              This frontend now connects to a live Node.js, Express, MongoDB backend with JWT authentication and
              protected subscription APIs.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <StatCard label="Auth" value="JWT" />
              <StatCard label="API" value="CRUD" />
              <StatCard label="Storage" value="MongoDB" />
            </div>
          </section>

          <section className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-8 text-slate-900 shadow-2xl">
            <div className="flex rounded-2xl bg-slate-100 p-1">
              <button
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  authMode === 'login' ? 'bg-slate-900 text-white' : 'text-slate-500'
                }`}
                onClick={() => setAuthMode('login')}
                type="button"
              >
                Login
              </button>
              <button
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  authMode === 'signup' ? 'bg-slate-900 text-white' : 'text-slate-500'
                }`}
                onClick={() => setAuthMode('signup')}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleAuthSubmit}>
              {authMode === 'signup' && (
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">Name</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                    onChange={(event) => setAuthForm((current) => ({ ...current, name: event.target.value }))}
                    placeholder="Your full name"
                    required
                    value={authForm.name}
                  />
                </label>
              )}

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Email</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                  onChange={(event) => setAuthForm((current) => ({ ...current, email: event.target.value }))}
                  placeholder="you@example.com"
                  required
                  type="email"
                  value={authForm.email}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Password</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-500"
                  minLength={6}
                  onChange={(event) => setAuthForm((current) => ({ ...current, password: event.target.value }))}
                  placeholder="Minimum 6 characters"
                  required
                  type="password"
                  value={authForm.password}
                />
              </label>

              {error && (
                <div className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={authLoading}
                type="submit"
              >
                {authLoading ? 'Please wait...' : authMode === 'login' ? 'Login' : 'Create account'}
              </button>
            </form>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <header className="rounded-[2rem] bg-slate-900 px-6 py-6 text-white shadow-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Connected Frontend</p>
              <h1 className="mt-2 text-3xl font-bold">Welcome back, {userName || 'User'}</h1>
              <p className="mt-2 text-slate-300">Manage subscriptions with live APIs backed by MongoDB.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DashboardStat label="Monthly spend" value={`$${totalMonthlyCost.toFixed(2)}`} />
              <DashboardStat label="Subscriptions" value={String(subscriptions.length)} />
              <button
                className="inline-flex items-center justify-center gap-2 rounded-3xl border border-white/10 bg-white/5 px-4 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
                onClick={handleLogout}
                type="button"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </header>

        {error && (
          <div className="mt-6 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-[2rem] bg-white p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Add Subscription</h2>
                <p className="text-sm text-slate-500">Creates a new protected record for the logged-in user.</p>
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleCreateSubscription}>
              <InputField
                icon={<CreditCard className="h-4 w-4" />}
                label="App Name"
                onChange={(value) => setSubscriptionForm((current) => ({ ...current, appName: value }))}
                placeholder="Netflix"
                value={subscriptionForm.appName}
              />

              <InputField
                icon={<DollarSign className="h-4 w-4" />}
                label="Cost"
                onChange={(value) => setSubscriptionForm((current) => ({ ...current, cost: value }))}
                placeholder="15.99"
                type="number"
                value={subscriptionForm.cost}
              />

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-600">Category</span>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
                  onChange={(event) => setSubscriptionForm((current) => ({ ...current, category: event.target.value }))}
                  value={subscriptionForm.category}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>

              <InputField
                icon={<Calendar className="h-4 w-4" />}
                label="Renewal Date"
                onChange={(value) => setSubscriptionForm((current) => ({ ...current, renewalDate: value }))}
                type="date"
                value={subscriptionForm.renewalDate}
              />

              <button
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={createLoading}
                type="submit"
              >
                <RefreshCw className={`h-4 w-4 ${createLoading ? 'animate-spin' : ''}`} />
                {createLoading ? 'Saving...' : 'Create Subscription'}
              </button>
            </form>
          </section>

          <section className="rounded-[2rem] bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">Your Subscriptions</h2>
                <p className="text-sm text-slate-500">Loaded from `GET /api/subscriptions` using your JWT token.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {subscriptionsLoading ? (
                <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
                  Loading subscriptions...
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 px-6 py-12 text-center text-slate-500">
                  No subscriptions yet. Add one using the form.
                </div>
              ) : (
                subscriptions.map((subscription) => (
                  <article
                    key={subscription._id}
                    className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
                        {subscription.category}
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-900">{subscription.appName}</h3>
                      <p className="mt-2 text-sm text-slate-500">
                        Renews on {new Date(subscription.renewalDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-slate-900 px-4 py-3 text-right text-white">
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Cost</p>
                        <p className="text-lg font-bold">${subscription.cost.toFixed(2)}</p>
                      </div>
                      <button
                        className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                        onClick={() => void handleDeleteSubscription(subscription._id)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-slate-950/10 p-4 backdrop-blur-sm">
      <p className="text-sm font-medium text-slate-900/70">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  );
}

function InputField({
  icon,
  label,
  onChange,
  placeholder,
  type = 'text',
  value,
}: {
  icon: ReactNode;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-600">
        <span className="text-slate-400">{icon}</span>
        {label}
      </span>
      <input
        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-500"
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required
        step={type === 'number' ? '0.01' : undefined}
        type={type}
        value={value}
      />
    </label>
  );
}
=======
import React from "react";

export default function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>✅ Subtrack App Running Successfully</h1>
      <p>If you see this, your Vercel deployment works 🎉</p>
    </div>
  );
}
>>>>>>> 35f08eff3d2c91024c3707fd280ae7f087963f84
