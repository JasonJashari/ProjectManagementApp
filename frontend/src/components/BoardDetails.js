import { Outlet, useNavigate, useParams } from "react-router"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { useAuth } from "../context/auth"
import axios from "../api/axios"
import { List } from "./List"

export const BoardDetails = () => {

    const auth = useAuth()
    const navigate = useNavigate()
    const { boardId } = useParams()

    const [lists, setLists] = useState([])
    const [title, setTitle] = useState('')
    const [outlet, setOutlet] = useState(false)
    const [showListForm, setShowListForm] = useState(false)
    const [listTitle, setListTitle] = useState('')

    const handleAddList = async (e) => {
        e.preventDefault()
        if (!listTitle){
            return
        }

        try {
            const response = await axios.post('/lists',
                JSON.stringify({ boardId, title: listTitle }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            )
            // set list
            setLists([
                ...lists,
                {title: response.data.title}
            ])

        } catch (error) {
            console.log('ERROR: Cannot create a new list', error)
        }
    }

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
                setLists(response.data.lists)
            } catch (error) {
                navigate('/')
            }
        }
        fetchBoard()
    }, [boardId, auth.token, navigate])

  return (
    <div>
        
        <Link to='/'>
            <button className='btn back'>
                Back
            </button>
        </Link>

        
        <section className='title'>
            <h1>{title}</h1>
        </section>

        <ul>
            {lists.map(list => (
                <div className='list blue'>
                    <li>
                        <List listTitle={list.title}/>
                    </li>
                </div>
            ))}

            { showListForm ? (
                <section>
                    <div className='form-group list grey'>
                        <li>
                            <form>
                                <input 
                                    type='text'
                                    required
                                    autoFocus
                                    className='form-control'
                                    placeholder='Enter list title...'
                                    value={listTitle}
                                    onChange={(e) => setListTitle(e.target.value)}
                                />
                                <button onClick={handleAddList} className='list-btn'>
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
                    <Link onClick={handleNewList}>
                        <div className='list new'>
                            <li>Add a list</li>
                        </div>
                    </Link>
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
