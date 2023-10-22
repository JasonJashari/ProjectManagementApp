import { Outlet, useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/auth"
import axios from "../api/axios"

export const BoardDetails = () => {

    const { boardId } = useParams()
    const [title, setTitle] = useState('')
    const [outlet, setOutlet] = useState(false)
    const [showListForm, setShowListForm] = useState(false)
    const [listTitle, setListTitle] = useState('')
    const auth = useAuth()
    const navigate = useNavigate()

    const handleDelete = async () => {
        try {
            await axios.delete(`/boards/${boardId}`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                }
            })
            navigate('/', { replace: true })
        } catch (error) {
            console.log('Cannot delete board', error)
        }
    }

    const handleNewList = () => {
        setShowListForm(!showListForm)
        console.log(showListForm)
    }

    const handleOutlet = () => {
        // update outlet
        setOutlet(!outlet)
    }

    useEffect(() => {
        // action on update of outlet
        outlet && navigate('update', { replace: true })
        !outlet && navigate('', { replace: true })
    }, [outlet, navigate])

    useEffect(() => {
        const fetchBoard = async () => {
            try {
                const response = await axios.get(`/boards/${boardId}`, {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                })
                setTitle(response.data.title)
                // setBoard(response.data)
            } catch (error) {
                navigate('/')
            }
        }
        fetchBoard()
    }, [boardId, auth.token, navigate])

  return (
    <div>
        <div className='form-group'>
            <Link to='/'>
                <button className='btn'>
                    Back
                </button>
            </Link>
        </div>

        
        <section className='heading'>
            <h1>{title}</h1>
        </section>

        <ul>
            { showListForm ? (
                <section>
            <div className='form-group list grey'>
                <li>
                    <form>
                        <input 
                            type='text'
                            className='form-control'
                            placeholder='Enter list title...'
                            value={listTitle}
                            onChange={(e) => setListTitle(e.target.value)}
                        />
                        <button className='list-btn'>
                            Add list
                        </button>
                        <button onClick={handleNewList} className='list-btn'>
                            Cancel
                        </button>
                    </form>
                </li>
            </div>
            </section> ) : (
                <section>
            <div className='list new'>
                <li onClick={handleNewList}>Add a list</li>
            </div>
            </section>
            )}
            
        </ul>
        <hr />

        <div className='form-group'>
            <button onClick={handleOutlet} className='btn'>Update Board Title</button>
        </div>
        <div className='form-group'>
            <button onClick={handleDelete} className='btn red'>Delete Board</button>
        </div>

        <Outlet context={[setTitle, handleOutlet]} />
    </div>
  )
}
