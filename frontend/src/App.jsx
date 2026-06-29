import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import Sidebar from './component/Sidebar'
import NotificationPage from './pages/NotificationPage'
import RightPanel from './component/RightPanel'
import LoadingSpinner from './component/LoadingSpinner'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { api } from './utils/axios'
import ChatPage from './pages/ChatPage'
import Messages from './component/Messages'

function App() {
  const { isPending, data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      try {
        const response = await api.get('/auth/me')
        console.log(response, response.data)

        return response.data
      } catch (error) {
        console.log(error)
        return null
      }
    }
  })
  if (isPending) {
    return (
      <div className='h-screen flex justify-center items-center '>
        <LoadingSpinner size='lg' />
      </div>
    )
  }

  return (

    <div className='flex max-w-6xl mx-auto'>
      {user && <Sidebar />}
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to={'/'} />} />
        <Route path='/notification' element={user ? <NotificationPage /> : <Navigate to={'/login'} />} />
        <Route path='/profile/:username' element={user ? <ProfilePage /> : <Navigate to={'/login'} />} />
        <Route path='/chat' element={user ? <ChatPage /> : <Navigate to={'/login'} />} >
          <Route index element={<div className="flex-1 flex items-center justify-center">Message someone</div>} />
          <Route path=":id" element={<Messages />} />
        </Route>

      </Routes>
      {user && <RightPanel />}
      <Toaster />
    </div>
  )
}

export default App
