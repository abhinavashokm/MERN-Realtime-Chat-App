import React, { useState, useContext } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { authContext } from '../../Auth/AuthContext'
import InputField from '../InputField/InputField'


function Login() {
  const navigate = useNavigate()
  const { setUser } = useContext(authContext)

  const [UserName, setUserName] = useState("")
  const [Password, setPassword] = useState("")
  const [loginErrorMsg, setLoginErrorMsg] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
    axios.post("http://localhost:3001/userLogin", {
      UserName,
      Password
    }).then((res) => {
      const login = res.data.login
      if (!login) {
        setLoginErrorMsg(res.data.errorMsg)
        console.log(res.data.errorMsg)
      } else {
        const userDetails = res.data.user[0]
        setLoginErrorMsg("")
        console.log("submitted")
        setUser(userDetails)
        navigate('/')
      }
    }).catch((err) => {
      setLoginErrorMsg("make sure your device is connected to the internet")
    })

  }

  return (
    <div className='Login-Page'>
      <h1>Login</h1>
      <form onSubmit={handleSubmit} >
        <div className="loginForm-container">
          {loginErrorMsg && <p className='loginError' >{loginErrorMsg}</p>}
          <InputField
            label="User Name"
            type="text"
            name="uname"
            placeholder="Enter Phone number"
            className="inputField"
            value={UserName}
            onChangeFunction={setUserName}
          />
          <InputField
            label="Password"
            type="password"
            name="psw"
            placeholder="Enter Password"
            className="inputField"
            value={Password}
            onChangeFunction={setPassword}
          />
          <button type="submit">Login</button>

        </div>
        <div className="signupRedirect">
          <span onClick={() => navigate('/signup')} >new user ?</span>
        </div>
      </form>
    </div>
  )
}

export default Login