import React,{useState} from 'react'
import './Signup.css'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'

function Signup() {
    const navigate = useNavigate()
    const [FullName, setFullName] = useState("")
    const [UserName, setUserName] = useState("")
    const [Password, setPassword] = useState("")
    const handleSubmit = async(e) => {
        e.preventDefault()
        axios.post("http://localhost:3001/createUser",{
            FullName,
            UserName,
            Password
        }).then((value) => {
            console.log("submitted")
            navigate('/login')
        }).catch((err)=>{
            console.log(err)
        })
    }
    return (
        <div className='SignUp-Page'>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div className="loginForm-container">

                    <label>Name</label>
                    <input onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Enter name" name="psw" required></input>

                    <label>User Name</label>
                    <input  onChange={(e) => setUserName(e.target.value)} type="text" placeholder="Enter Username" name="uname" required />

                    <label>Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter Password" name="psw" required></input>

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