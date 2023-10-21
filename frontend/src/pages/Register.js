import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from '../api/axios'

const REGISTER_URL = '/user/signup'

export default function Register() {

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formData

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ email, password }),
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            )
            console.log(response.data)
            console.log(JSON.stringify(response))
            setSuccess(true)
        } catch (error) {
            if (error.response?.status === 422) {
                setErrMsg('User taken')
            } else {
                setErrMsg('Registration Failed')
            }
        }
    }

    return (
        <>
        {success ? (
            <section className='heading'>
                <h1>Success!</h1>
                <p>
                    <Link to='/login'>Sign In</Link>
                </p>
            </section>
        ) : (
            <section>
                <p>{errMsg}</p>

                <section className='heading'>
                    <h1>Register</h1>
                    <p>Create an account</p>
                </section>

                <section className='form'>
                    <form onSubmit={onSubmit}>
                        <div className='form-group'>
                            <input
                                type='text'
                                className='form-control'
                                id='name'
                                name='name'
                                value={name}
                                placeholder='Name'
                                onChange={onChange} />
                        </div>

                        <div className='form-group'>
                            <input
                                type='email'
                                className='form-control'
                                id='email'
                                name='email'
                                value={email}
                                placeholder='Email'
                                onChange={onChange} />
                        </div>

                        <div className='form-group'>
                            <input
                                type='password'
                                className='form-control'
                                id='password'
                                name='password'
                                value={password}
                                placeholder='Password'
                                onChange={onChange} />
                        </div>

                        <div className='form-group'>
                            <input
                                type='password'
                                className='form-control'
                                id='password2'
                                name='password2'
                                value={password2}
                                placeholder='Confirm Password'
                                onChange={onChange} />
                        </div>

                        <div className='form-group'>
                            <button type='submit' className='btn btn-block'>
                                Submit
                            </button>
                        </div>
                    </form>
                </section>
            </section>
        )}
        </>
    )
}