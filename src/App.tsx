import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import { useAuth } from './hooks/useAuth'
import About from './pages/About'

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
        <Header />

        <Routes>
          <Route path='/' element={user ? <Home /> : <Navigate to={'/sign-in'} />} />

          <Route path='/sign-in' element={!user ? <SignIn />: <Navigate to={'/'} />} />
          <Route path='/sign-up' element={<SignUp />} />
          <Route path='/about' element={<About />} />
        </Routes>

    </BrowserRouter>
  )
}

export default App
