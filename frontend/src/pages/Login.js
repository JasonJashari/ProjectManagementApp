import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/auth'
import axios from '../api/axios'

const LOGIN_URL = '/user/login'


export default function Login() {

    const auth = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')
    const [errMsg, setErrMsg] = useState('')

    useEffect(() => {
        setErrMsg('')
    }, [email, pwd])

    const onSubmit = async (e) => {
        e.preventDefault()

        try {
            const response = await axios.post(LOGIN_URL,
                JSON.stringify({email, password: pwd}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
            )
            const token = response?.data?.token
            auth.login(token)
            setEmail('')
            setPwd('')
            navigate('/', { replace: true })

        } catch (error) {
            if (!error?.response) {
                setErrMsg('No Server Response')
            } else if (error.response?.status === 401) {
                setErrMsg('Incorrect Email or Password')
            } else {
                setErrMsg('Login Failed')
            }
        }
    }

    return (
        <>
            <section>
                <p>{errMsg}</p>
            </section>

            <section className='heading'>
                <h1>Login</h1>
                <p>Login to manage your projects</p>
            </section>

            <section className='form'>
                <form onSubmit={onSubmit}>
                    <div className='form-group'>
                        <input
                            type='email'
                            className='form-control'
                            id='email'
                            name='email'
                            value={email}
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>

                    <div className='form-group'>
                        <input
                            type='password'
                            className='form-control'
                            id='password'
                            name='password'
                            value={pwd}
                            placeholder='Password'
                            onChange={(e) => setPwd(e.target.value)} />
                    </div>

                    <div className='form-group'>
                        <button type='submit' className='btn btn-block'>
                            Login
                        </button>
                    </div>
                </form>
            </section>
        </>
    )
}