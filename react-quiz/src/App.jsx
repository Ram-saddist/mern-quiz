import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import Login from './Login'
import Navigation from './Navigation'
import TakeExam from './TakeExam'
import Admin from './Admin'
export default function App() {
  return (
    <BrowserRouter>
    <Navigation/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/take-exam' element={<TakeExam/>}/>
      </Routes>
    </BrowserRouter>
  )
}