import { useNavigate } from "react-router"
import { useAuth } from "../context/auth"
import User from "./User"

export const Profile = () => {

  const auth = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  return (
    <>
      <section className='title'>
        <h1>Profile</h1>
      </section>

      <User />

      <section className='form'>
        <div className='form-group'>
          <button onClick={handleLogout} className='btn btn-block'>Logout</button>
        </div>
      </section>
    </>
  )
}
