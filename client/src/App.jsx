import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Content from './pages/Content'
import Admin from './pages/Admin'


function App() {


  return (
   <Routes>
      <Route path="/" element={<Content/>} />
      <Route path="/admin" element={<Admin/>} />
   </Routes>
  )
}

export default App
