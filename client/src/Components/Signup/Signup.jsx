import React from 'react'
import './Signup.css'
import {useNavigate} from 'react-router-dom'

function Signup() {
    const navigate = useNavigate()
    return (
        <div className='SignUp-Page'>
            <h1>Sign Up</h1>
            <form action="">
                <div className="loginForm-container">

                    <label>Name</label>
                    <input type="password" placeholder="Enter name" name="psw" required></input>

                    <label>Phone No</label>
                    <input type="text" placeholder="Enter Username" name="uname" required />

                    <label>Password</label>
                    <input type="password" placeholder="Enter Password" name="psw" required></input>

                    <button type="submit">Signup</button>

                </div>
                <div className="LoginRedirect">
                    <span onClick={()=> navigate('/login')} >already have an accout ?</span>
                </div>
            </form>
        </div>
    )
}

export default Signup