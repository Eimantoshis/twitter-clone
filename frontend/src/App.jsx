import { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

import HomePage from './pages/home/HomePage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import SignUpPage from './pages/auth/signUp/SignUpPage.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'

import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/RightPanel.jsx'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import LoadingSpinner from './components/common/LoadingSpinner.jsx'
import PostPage from './pages/post/PostPage.jsx'

function App() {

  const {data: authUser, isLoading} = useQuery({
    queryKey: ["authUser"],
    queryFn: async() => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.error) return null;

        if(!res.ok || data.error) throw new Error(data.error || 'Failed to fetch user data');
        console.log("authUser is here:",data);
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry: false,
  });

  if (isLoading) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>

      </div>
    )
  }

  return (
    <div className='flex max-w-6xl mx-auto'>
      {authUser && <Sidebar /> }
      <Routes>
        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login"/>} />
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/"/>} />
        <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/"/>} />
        <Route path='/notifications' element={authUser ? <NotificationPage /> : <Navigate to="/login"/>} />
        <Route path='/profile/:username' element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />
        <Route path='/post/:postId' element={authUser ? <PostPage /> : <Navigate to="/login"/>} />
      </Routes>
      {authUser && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App