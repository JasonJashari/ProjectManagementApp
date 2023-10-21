import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth'
import axios from '../api/axios'

const User = () => {

    const auth = useAuth()
    const [ user, setUser ] = useState(null)

    // Could read token

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('/user', { 
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                })
                setUser(response.data)
            } catch (error) {
                console.log('Fetch user info error: ', error)
            }
        }

        fetchUser()
    }, [auth.token])

    return (
        <article>
            {user ? 
            (
                <ul>
                <li>ID: {user.id}</li>
                <li>Username: {user.username}</li>
                <li>Email: {user.email}</li>
                </ul>
            ) : <p>No user to display</p>
            }
        </article>
    )
}

export default User