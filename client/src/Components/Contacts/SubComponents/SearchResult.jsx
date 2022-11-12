import React, { useContext, useEffect, useState } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { authContext } from '../../../Auth/AuthContext'
import axios from 'axios'

function SearchResult({ props }) {

    const { search } = props
    const { setCurrentChat, currentChat } = useContext(currentChatContext)
    const { user } = useContext(authContext)

    const [allUsers, setAllUsers] = useState([])

    //for getting data of all users
    useEffect(() => {
        axios.get("http://localhost:3001/getAllContacts").then((res) => {
            if (!res.data) {
                console.log("something went wrong")
            } else {
                if (user) {
                    let contacts = res.data.filter(contact => contact._id !== user._id)
                    setAllUsers(contacts)
                }
            }
        })
    }, [user])

    let selectedSearchItem = false

    return (
        <div>
            {
                allUsers.filter(contact => contact.FullName.toLowerCase().startsWith(search.toLowerCase()) || contact.UserName.toLowerCase().startsWith(search.toLowerCase()))
                    .map((contact, index) => {
                        if (currentChat && contact._id === currentChat._id) {
                            selectedSearchItem = true
                        } else {
                            selectedSearchItem = false
                        }
                        return (
                            <div key={index}
                                onClick={() => {
                                    setCurrentChat(contact)
                                }}
                                className={selectedSearchItem ? "selected-search-contact-item" : "search-contact-item"}
                            >
                                <span className='search-contactName'>{contact.FullName}</span>
                                <span className='userName' >{contact.UserName}</span>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default SearchResult