import { useState, useEffect } from "react"
import { useAuth } from "../context/auth"
import axios from "../api/axios"
import { Link } from "react-router-dom"


export default function Home() {

    const auth = useAuth()
    const [boards, setBoards] = useState([])

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const response = await axios.get('/boards', {
                    headers: {
                        'Authorization': `Bearer ${auth.token}`
                    }
                })
                setBoards(response.data.boards)
            } catch (error) {
                console.log('ERROR FETCHING BOARDS', error)
            }
        }
        fetchBoards()
    }, [auth.token])

    return (
        <div>
            <h1>Boards</h1>
            <ul>
                <Link to='board/new'>
                    <div className='board new'>
                        <li>Create new board</li>
                    </div>
                </Link>
                {
                    boards.map((board) => (
                        <Link key={board.id} to={`/board/${board.id}`}>
                            <div className='board blue'>
                                <li>{board.title}</li>
                            </div>
                        </Link>
                    ))
                }
            </ul>
        </div>
    )
}