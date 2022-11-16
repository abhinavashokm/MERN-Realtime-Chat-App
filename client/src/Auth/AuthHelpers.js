import { createContext, useContext } from "react";
import axios from "axios";
import { confirmAlert } from 'react-confirm-alert'; // Import alert npm
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for alert
import { authContext } from "./AuthContext";
import { currentChatContext } from "../Store/CurrentChat";
import { contactListContext } from "../Store/ContactList";
import { getCurrentTime } from "../Helpers/HelperFunctions";

//CONTEXT
export const authHelpers = createContext(null)

//CONTEXT PROVIDER
export const AuthHelpersProvider = ({ children }) => {
    const { user, setUser, socket } = useContext(authContext)
    const { setCurrentChat } = useContext(currentChatContext)
    const { setContactsList } = useContext(contactListContext)


    const signup = (FullName, UserName, Password) => {
        return new Promise((resolve, reject) => {
            const currentHoursAndMinutes = getCurrentTime()
            axios.post("http://localhost:3001/createUser", {
                FullName,
                UserName,
                Password,
                LastSeen: currentHoursAndMinutes
            }).then(() => {
                console.log("submitted")
                alert("Your account has been created successfully")
                resolve(true)
            }).catch((err) => {
                reject(err)
            })
        })
    }

    const login = (UserName, Password) => {
        return new Promise((resolve, reject) => {
            axios.post("http://localhost:3001/userLogin", {
                UserName,
                Password
            }).then((res) => {
                const result = res.data
                if (!result.login) {
                    reject(res.data.errorMsg)
                } else {
                    resolve(res.data.user[0])
                }
            }).catch(() => {
                reject("make sure your device is connected to the internetvs")
            })
        })
    }

    const logout = () => {
        confirmAlert({
            title: 'Logout',
            message: 'Are you sure want to logout,all chats you made will lost!',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        setCurrentChat(null)
                        socket.current.emit("removeUser", { userId: user._id })
                        setUser(null)
                        setContactsList(null)
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        })
    }

    return (
        <authHelpers.Provider value={{ logout, login, signup }} >
            {children}
        </authHelpers.Provider>
    )
}