import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Post from '../../components/common/Post.jsx'
import toast from 'react-hot-toast'
import PostSkeleton from '../../components/skeletons/PostSkeleton'

function PostPage() {
    const { postId } = useParams();

    const {data: post, isLoading, error} = useQuery({
        queryKey: ["post", postId],
        queryFn: async () => {
            try {
                const res = await fetch(`/api/posts/${postId}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch post");
                return data;
            } catch (error) {
                throw error;
            }
        },
        retry: 1, // limit retries for better UX
        refetchOnWindowFocus: false,
    })

    useEffect(() => {
        if (error) {
            toast.error("Post is no longer available");
        }
    }, [error]);

    if (isLoading) {
        return (
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Post</p>
                </div>
                <PostSkeleton />
            </div>
        )
    }

    if (error) {
        return (
            <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
                <div className='flex items-center p-4 border-b border-gray-700'>
                    <p className='font-bold'>Post</p>
                </div>
                <div className='flex justify-center items-center h-64'>
                    <p className='text-gray-300 font-bold text-lg'>This post is no longer available.</p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex-[4_4_0] border-l border-r border-gray-700 min-h-screen'>
            <div className='flex items-center p-4 border-b border-gray-700'>
                <p className='font-bold'>Post</p>
            </div>
            {post && <Post post={post} />}
        </div>
    )
}

export default PostPage