import { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import Sidebar from './component/Sidebar'
import RightPanel from './component/RightPanel'
import LoadingSpinner from './component/LoadingSpinner'
import ProfilePage from './pages/ProfilePage'
import { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { api } from './utils/axios'

function App() {
  const {isPending,data: user} = useQuery({
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
      <Sidebar />
      <Routes>
        <Route path='/' element={user ? <HomePage /> : <Navigate to={'/login'} />} />
        <Route path='/login' element={!user ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path='/signup' element={!user ? <SignupPage /> : <Navigate to={'/'} />} />
        <Route path='/profile/johndoe' element={user ? <ProfilePage /> : <Navigate to={'/login'} />} />
      </Routes>
      <RightPanel />
      <Toaster />
    </div>
  )
}

export default App
