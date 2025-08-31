import React from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'

function App() {

  return (
    <>
      <div className="text-3xl font-bold underline">Site Logo</div>
      <Outlet />
    </>
  )
}

export default App
