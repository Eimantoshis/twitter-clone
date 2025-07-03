import { useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'

import HomePage from './pages/home/HomePage.jsx'
import LoginPage from './pages/auth/login/LoginPage.jsx'
import SignUpPage from './pages/auth/signUp/SignUpPage.jsx'
import NotificationPage from './pages/notification/NotificationPage.jsx'
import ProfilePage from './pages/profile/ProfilePage.jsx'

import Sidebar from './components/common/Sidebar.jsx'
import RightPanel from './components/common/RightPanel.jsx'

function App() {
  const location = useLocation()
  const hideNavigation = ['/login', '/signup'].includes(location.pathname)

  return (
    <div className='flex max-w-6xl mx-auto'>
      {!hideNavigation && <Sidebar />}
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/notifications' element={<NotificationPage />} />
        <Route path='/profile/:username' element={<ProfilePage />} />
      </Routes>
      {!hideNavigation && <RightPanel />}
    </div>
  )
}

export default App