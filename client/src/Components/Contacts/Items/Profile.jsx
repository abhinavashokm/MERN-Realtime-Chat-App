import React,{useContext} from 'react'
import { authContext } from '../../../Auth/AuthContext'
import { authHelpers } from '../../../Auth/AuthHelpers'

function Profile() {

    const { user } = useContext(authContext)
    const { logout } = useContext(authHelpers)

    const logoutHelper = () => {
        logout()
      }

    return (
        <div className="Profile">
            <img src="Images/user.png" alt="person" />
            {user && <span>{user.FullName}</span>}
            <button onClick={logoutHelper} >Logout</button>
        </div>
    )
}

export default Profile