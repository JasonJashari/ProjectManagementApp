import { useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router"
import { useAuth } from "../context/auth"
import axios from "../api/axios"

export const BoardUpdate = () => {

    const auth = useAuth()
    const navigate = useNavigate()
    const [setBoardTitle, handleOutlet] = useOutletContext()
    const [title, setTitle] = useState('')
    const { boardId } = useParams()


    const handleSubmit = async (e) => {
        e.preventDefault()

        const updates = [
            {
                "propName": 'title',
                "value": title
            }
        ]

        try {
            await axios.patch(`/boards/${boardId}`, updates,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${auth.token}`
                    }
                }
            )

            // Update the title state and reset the outlet state
            setBoardTitle(title)
            handleOutlet()

            navigate(`/board/${boardId}`, { replace: true })
        } catch (error) {
            console.log(error)
            // Can set error message state
        }
    }

  return (
    <>
        <h2>Update board title</h2>

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
                        Update
                    </button>
                </div>
            </form>
        </section>
    </>
  )
}
