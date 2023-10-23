import { useNavigate, useParams } from "react-router"
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
    const [showUpdateForm, setShowUpdateForm] = useState(false)
    const [showListForm, setShowListForm] = useState(false)
    const [listTitle, setListTitle] = useState('')

    const handleUpdateTitle = async (e) => {
        e.preventDefault()
        if (!title){
            return
        }

        try {
            await axios.patch(`/boards/${boardId}`, [
                {
                    "propName": 'title',
                    "value": title
                }
            ],
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            )
            setShowUpdateForm(false)
        } catch (error) {
            console.log('Cannot update board title at this time')
        }
    }

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
            setShowListForm(false)

        } catch (error) {
            console.log('ERROR: Cannot create a new list')
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

    const handleUpdate = () => {
        setShowUpdateForm(!showUpdateForm)
    }

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
            <button className='btn left'>
                Back
            </button>
        </Link>

        {showUpdateForm ? (
            <section className='title'>
                    <form onSubmit={handleUpdateTitle} className='form-update'>
                        <input 
                            type='text'
                            id='boardTitle'
                            autoFocus
                            placeholder='Enter board title'
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <button type='submit' className='update'>
                            Update
                        </button>
                    </form>
            </section>
        ) : (
            <section className='title'>
                <h1>{title}</h1>
            </section>
        )}

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
                    <div className='list grey'>
                        <li>
                            <form onSubmit={handleAddList} className='form-group'>
                                <input 
                                    type='text'
                                    id='listTitle'
                                    required
                                    autoFocus
                                    placeholder='Enter list title...'
                                    value={listTitle}
                                    onChange={(e) => setListTitle(e.target.value)}
                                />
                                <button type='submit' className='list-btn'>
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
            <button onClick={handleUpdate} className='btn'>Update Board Title</button>
        </div>
        <div className='form-group'>
            <button onClick={handleDelete} className='btn red'>Delete Board</button>
        </div>
    </div>
  )
}
