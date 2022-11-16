import React, { useState, useContext } from 'react'
import './Login.css'
import { useNavigate } from 'react-router-dom'
import { authContext } from '../../Auth/AuthContext'
import { authHelpers } from '../../Auth/AuthHelpers'
import InputField from '../InputField/InputField'


function Login() {
  const navigate = useNavigate()
  const { setUser } = useContext(authContext)
  const { login } = useContext(authHelpers)

  const [UserName, setUserName] = useState("")
  const [Password, setPassword] = useState("")
  const [loginErrorMsg, setLoginErrorMsg] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    login(UserName, Password).then((userDetails) => {
      setLoginErrorMsg("")
      setUser(userDetails)
      navigate('/')
    }).catch((errMsg) => {
      setLoginErrorMsg(errMsg)
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