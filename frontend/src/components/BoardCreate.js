import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { useAuth } from "../context/auth"
import axios from "../api/axios"

export const BoardCreate = () => {

    const auth = useAuth()
    const navigate = useNavigate()

    const [errMsg, setErrMsg] = useState('')
    const [title, setTitle] = useState('')

    useEffect(() => {
        setErrMsg('')
    }, [title])

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post('/boards',
                JSON.stringify({title}),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            )
            const boardId = response.data.createdBoard.id
            navigate(`/board/${boardId}`, { replace: true })
        } catch (error) {
            if (!error.response) {
                setErrMsg('No Server Response')
            } else if (error.response?.status === 400) {
                setErrMsg('Please provide a title')
            } else {
                setErrMsg('Cannot create new board')
            }
        }
    }

  return (
      <>
      
        <section>
            <p>{errMsg}</p>
        </section>

        <section className='heading'>
            <h1>Create board</h1>
            <p>Start your new project</p>
        </section>

        <section className='form'>
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input 
                        type='text'
                        required
                        className='form-control'
                        id='title'
                        name='title'
                        value={title}
                        placeholder='Board title'
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <button type='submit' className='btn btn-block'>
                        Create
                    </button>
                </div>

                <Link to='/'>
                    <button className='btn'>
                        Back
                    </button>
                </Link>
            </form>
        </section>
    </>
  )
}
