import React,{ useEffect, useRef, useContext } from 'react';
import { io } from 'socket.io-client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Login from './Components/Login/Login';
import Signup from './Pages/Signup/Signup';
import {userContext} from './Store/UserContext';
import './App.css'

function App() {
  const {user} = useContext(userContext)

  let socket = useRef(null)
  useEffect(() => {
    socket.current = io("http://localhost:3001")
  }, [])

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Home user={user}/>} path="/" />
          <Route element={<Login/>} path="/login" />
          <Route element={<Signup/>} path="/signup" />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
