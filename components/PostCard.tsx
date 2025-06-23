'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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

const PostCard = ({ post, isAdmin }: { post: Post, isAdmin: boolean }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);

  useEffect(() => {
    if (session?.user?.id && post.likes.includes(session.user.id)) {
      setIsLiked(true);
    }
  }, [session, post.likes]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });
      router.refresh();
    }
  };

  const handleLike = async () => {
    const res = await fetch(`/api/posts/${post._id}/like`, {
      method: 'POST',
    });
    const data = await res.json();
    setIsLiked(data.isLiked);
    setLikeCount(data.likeCount);
  };

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    await fetch(`/api/posts/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: e.target.value }),
    });
    router.refresh();
  };

  const isOwner = session?.user?.id === post.userId._id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{post.title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by {post.userId.username}</p>
          <p className="text-gray-700 dark:text-gray-300">{post.body}</p>
        </div>
        <div className="flex flex-col items-end">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'Completed' ? 'bg-green-500 text-white' : post.status === 'In Progress' ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'}`}>
          {post.status}
        </span>
        {isAdmin && (
            <select onChange={handleStatusChange} defaultValue={post.status} className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
            </select>
        )}
        </div>
      </div>
      <div className="flex justify-end items-center mt-4">
        <button onClick={handleLike} className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500">
            <svg className={`w-6 h-6 ${isLiked ? 'text-red-500' : ''}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
            <span>{likeCount}</span>
        </button>
        {isOwner && (
          <div className="flex space-x-2 ml-4">
            <Link href={`/posts/${post._id}/edit`} className="text-sm text-blue-500 hover:underline">Edit</Link>
            <button onClick={handleDelete} className="text-sm text-red-500 hover:underline">Delete</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
