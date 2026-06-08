import { useState } from 'react'
import { Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import Sidebar from './component/Sidebar'
import RightPanel from './component/RightPanel'
import ProfilePage from './pages/ProfilePage'

function App() {

  return (
    
    <div className='flex max-w-6xl mx-auto'>
      <Sidebar />
      <Routes>
        <Route path='/' element = {<HomePage />} />
        <Route path='/login' element = {<LoginPage />} />
        <Route path='/signup' element = {<SignupPage />} />
        <Route path = '/profile/johndoe' element = { <ProfilePage />} />
      </Routes>
      <RightPanel />
    </div>
  )
}

export default App
