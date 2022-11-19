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
        <div className="profileBand">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7ECizMinUV4oPQG6BUFIZZmeXehbj7pytQ&usqp=CAU" alt="person" />
            {user && <span>{user.FullName}</span>}
            <button onClick={logoutHelper} >Logout</button>
        </div>
    )
}

export default Profile