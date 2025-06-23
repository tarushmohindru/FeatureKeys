"use client"
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });
  
      if (res.ok) {
        const result = await signIn('credentials', {
          redirect: false,
          login: form.email,
          password: form.password,
        });

        if (result?.error) {
          setError('Account created but sign-in failed. Please try signing in manually.');
        } else {
          router.push('/');
        }
      } else {
        const { error } = await res.json();
        setError(error.message || error || 'An error occurred while signing up. Please try again.');
      }
    } catch (err) {
        setError('An unexpected error occurred. Please try again.');
        console.log(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black bg-opacity-90">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-900 bg-opacity-80 p-8 rounded-xl shadow-lg w-full max-w-md flex flex-col gap-6"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">Sign Up</h2>
        <p className="text-zinc-300 text-center mb-4">Create your account to join the community.</p>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoComplete="username"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoComplete="email"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500"
          autoComplete="new-password"
        />
        {error && <div className="text-pink-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors shadow-md disabled:bg-violet-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
        <Link href={"/signin"} className="mt-2 py-3 text-white text-center w-full">Already have an account? Sign in instead</Link>
      </form>
    </div>
  );
}
