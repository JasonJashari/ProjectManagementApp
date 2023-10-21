import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/auth'

export default function Layout() {

  const auth = useAuth()

  return (
    <>
      <header className='header'>
          <div>
            <ul>
              <li>
                <NavLink to='/'>Home</NavLink>
              </li>
            </ul>
          </div>
          {
            !auth.token && (
              <ul>
                <li>
                  <NavLink to='/login'>Login</NavLink>
                </li>
                <li>
                  <NavLink to='/register'>Register</NavLink>
                </li>
              </ul>
            )
          }
          {
            auth.token && (
              <ul>
                <li>
                  <NavLink to='/profile'>Profile</NavLink>
                </li>
              </ul>
            )
          }
      </header>


      <main>
          <Outlet />
      </main>
    </>
  )
}
