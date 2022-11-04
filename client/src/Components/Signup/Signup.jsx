import React, { useState } from 'react'
import './Signup.css'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getCurrentTime } from '../../Store/Date'
import InputField from '../InputField/InputField'

function Signup() {

    const navigate = useNavigate()
    const [FullName, setFullName] = useState("")
    const [UserName, setUserName] = useState("")
    const [Password, setPassword] = useState("")
    const handleSubmit = async (e) => {
        const currentHoursAndMinutes = getCurrentTime()
        e.preventDefault()
        axios.post("http://localhost:3001/createUser", {
            FullName,
            UserName,
            Password,
            LastSeen: currentHoursAndMinutes
        }).then(() => {
            console.log("submitted")
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