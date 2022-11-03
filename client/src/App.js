import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home'
import Login from './Components/Login/Login';
import Signup from './Pages/Signup/Signup';
import { authContext } from './Auth/AuthContext';
import './App.css'

function App() {
  const { user } = useContext(authContext)

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<Home user={user} />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Signup />} path="/signup" />
        </Routes>
      </Router>
    </div>
  )
}

export default App;
