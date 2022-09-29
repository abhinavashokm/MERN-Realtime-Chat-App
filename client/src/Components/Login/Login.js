import React from 'react'
import './Login.css'
import {useNavigate} from 'react-router-dom'


function Login() {
  const navigate = useNavigate()
  return (
    <div className='Login-Page'>
      <h1>Login</h1>
      <form action="">
        <div className="loginForm-container">

          <label>Phone No</label>
          <input type="text" placeholder="Enter Phone number" name="uname" required />

          <label>Password</label>
          <input type="password" placeholder="Enter Password" name="psw" required></input>

          <button type="submit">Login</button>

        </div>
        <div className="signupRedirect">
          <span onClick={()=> navigate('/signup')} >new user ?</span>
        </div>
      </form>
    </div>
  )
}

export default Login