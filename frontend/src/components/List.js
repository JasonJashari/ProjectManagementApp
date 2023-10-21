import { useEffect, useState } from 'react'
import { useAuth } from '../context/auth'
import axios from '../api/axios'

export const List = ({ listId }) => {

  const auth = useAuth()
  const [title, setTitle] = useState('')

  useEffect(() => {
      const fetchList = async () => {
        try {
            const response = await axios.get(`/lists/${listId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            setTitle(response.data.title)
        } catch (error) {
            console.log('ERROR FETCHING LIST: ', error)
        }
      }

      fetchList()
  }, [auth.token, listId])

  return (
    <div className='list'>
        {title}
    </div>
  )
}
