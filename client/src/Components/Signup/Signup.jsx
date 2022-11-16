import React, { useState, useContext } from 'react'
import './Signup.css'
import { useNavigate } from 'react-router-dom'
import InputField from '../InputField/InputField'
import { authHelpers } from '../../Auth/AuthHelpers'

function Signup() {

    const navigate = useNavigate()
    const { signup } = useContext(authHelpers)
    const [FullName, setFullName] = useState("")
    const [UserName, setUserName] = useState("")
    const [Password, setPassword] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        signup(FullName, UserName, Password).then(() => {
            navigate('/login')
        }).catch((err) => {
            console.log(err)
        })
    }

    return (
        <div className='SignUp-Page'>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="loginForm-container">
                    <InputField
                        label="Name"
                        type="text"
                        name="name"
                        placeholder="Enter name"
                        className="SignUp-Page-input"
                        value={FullName}
                        onChangeFunction={setFullName}
                    />
                    <InputField
                        label="User Name"
                        type="text"
                        name="uname"
                        placeholder="Enter Username"
                        className="SignUp-Page-input"
                        value={UserName}
                        onChangeFunction={setUserName}
                    />
                    <InputField
                        label="Password"
                        type="password"
                        name="psw"
                        placeholder="Enter Password"
                        className="SignUp-Page-input"
                        value={Password}
                        onChangeFunction={setPassword}
                    />
                    <button type="submit">Signup</button>

                </div>
                <div className="LoginRedirect">
                    <span onClick={() => navigate('/login')} >already have an accout ?</span>
                </div>
            </form>
        </div>
    )
}

export default Signup