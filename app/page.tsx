'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';

interface Post {
  _id: string;
  title: string;
  body: string;
  userId: {
    _id: string;
    username: string;
  };
  status: string;
  likes: string[];
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts);
      setFilteredPosts(data.posts);
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const sortedPosts = [...posts];
    if (activeTab === 'All') {
      setFilteredPosts(posts);
    } else if (activeTab === 'Most Liked') {
      sortedPosts.sort((a, b) => b.likes.length - a.likes.length);
      setFilteredPosts(sortedPosts);
    } else {
      const filtered = posts.filter(post => post.status === activeTab);
      setFilteredPosts(filtered);
    }
  }, [activeTab, posts]);

  const isAdmin = session?.user?.role === 'admin';

  const handleSignOut = () => {
    signOut({ callbackUrl: '/signin' });
  };

  return (
    <div className="min-h-screen flex flex-col font-[family-name:var(--font-geist-sans)] bg-gray-50 dark:bg-gray-900">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-lg text-gray-900 dark:text-gray-100">
              FeatureKeys
            </span>
          </Link>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link href={"/create"} className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Create
                </Link>
                <div className="relative">
                  <div 
                    className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <svg
                      className="w-6 h-6 text-gray-600 dark:text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      ></path>
                    </svg>
                  </div>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm text-gray-900 dark:text-gray-100">Welcome, {session.user?.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{session.user?.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/signin" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
                  Sign In
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto p-4">
            <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center" id="myTab" data-tabs-toggle="#myTabContent" role="tablist">
                    <li className="mr-2" role="presentation">
                        <button onClick={() => setActiveTab('All')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'All' ? 'border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`} type="button">All</button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button onClick={() => setActiveTab('Pending')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'Pending' ? 'border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`} type="button">Pending</button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button onClick={() => setActiveTab('In Progress')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'In Progress' ? 'border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`} type="button">In Progress</button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button onClick={() => setActiveTab('Completed')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'Completed' ? 'border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`} type="button">Completed</button>
                    </li>
                    <li className="mr-2" role="presentation">
                        <button onClick={() => setActiveTab('Most Liked')} className={`inline-block p-4 border-b-2 rounded-t-lg ${activeTab === 'Most Liked' ? 'border-blue-500' : 'border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'}`} type="button">Most Liked</button>
                    </li>
                </ul>
            </div>

          {filteredPosts.map(post => (
            <PostCard key={post._id} post={post} isAdmin={isAdmin} />
          ))}
        </div>
      </main>
    </div>
  );
}
