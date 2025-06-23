'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditPostPage({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`/api/posts/${params.id}`);
      const data = await res.json();
      setTitle(data.post.title);
      setBody(data.post.body);
    };
    fetchPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`/api/posts/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, body }),
    });
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-[family-name:var(--font-geist-sans)]">
        <header className="border-b border-gray-200 dark:border-gray-800">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <a href="/" className="flex items-center space-x-2">
                <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
                My App
                </span>
            </a>
            </div>
        </header>
        <main className="container mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Edit Feature Proposal</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter a title for your proposal"
                />
                </div>
                <div className="mb-6">
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body</label>
                <textarea
                    id="body"
                    rows={8}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your new feature proposal in detail"
                ></textarea>
                </div>
                <div className="flex justify-end">
                <button
                    type="submit"
                    className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                    Update Proposal
                </button>
                </div>
            </form>
            </div>
        </main>
    </div>
  );
}
