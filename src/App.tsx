import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Header from './components/Header'
import AuthProvider from './components/AuthProvider'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sign-in' element={<SignIn />} />
          <Route path='/sign-up' element={<SignUp />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
