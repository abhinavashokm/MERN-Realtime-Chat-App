import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/home'
import './App.css'

function App() {
  let socket = useRef(null)
  useEffect(() => {
    socket.current = io("http://localhost:3001")
  }, [])

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Home/>} path="/" />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
