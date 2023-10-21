import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'

// pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register';

import Layout from './components/Layout';
import { RequireAuth } from './components/RequireAuth';
import { NoMatch } from './components/NoMatch';
import { Profile } from './components/Profile';
import { BoardDetails } from './components/BoardDetails';
import { BoardCreate } from './components/BoardCreate';
import { BoardUpdate } from './components/BoardUpdate';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route index element={<RequireAuth><Home /></RequireAuth>} />
      <Route path='profile' element={<RequireAuth><Profile /></RequireAuth>} />
      <Route path='board/new' element={<RequireAuth><BoardCreate /></RequireAuth>} />

      <Route path='board/:boardId' element={<RequireAuth><BoardDetails /></RequireAuth>}>
        <Route path='update' element={<BoardUpdate />} />
      </Route>

      <Route path='login' element={<Login />} />
      <Route path='register' element={<Register />} />
      <Route path='*' element={<NoMatch />} />
    </Route>
  )
)

function App() {
  return (
    <div className='container'>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
