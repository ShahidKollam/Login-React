import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
//import AuthProvider from './components/AuthProvider'
import { useAuth } from './hooks/useAuth'

function App() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
        <Header />

        <Routes>
          <Route path='/' element={user ? <Home /> : <Navigate to={'/sign-in'} />} />

          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>

    </BrowserRouter>
  )
}

export default App
