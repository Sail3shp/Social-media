import { useState } from 'react'
import { Route, Routes } from 'react-router'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import HomePage from './pages/HomePage'

function App() {

  return (
    
    <div className='flex max-w-6xl mx-auto'>
      <Routes>
        <Route path='/' element = {<HomePage />} />
        <Route path='/login' element = {<LoginPage />} />
        <Route path='/signup' element = {<SignupPage />} />
      </Routes>
    </div>
  )
}

export default App
