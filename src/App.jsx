import  { useState, useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import PokemonList from './pages/PokemonList'
import PokemonDetail from './pages/PokemonDetail'
import Favorites from './pages/Favorites'

function App() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const savedUser = localStorage.getItem('pokemon_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem('pokemon_user', JSON.stringify(userData))
    navigate('/')
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('pokemon_user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-red-500">Deepsolv</Link>
        {user ? (
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-gray-600 hover:text-red-500">Home</Link>
            <Link to="/pokemon" className="text-gray-600 hover:text-red-500">Pokemon</Link>
            <Link to="/favorites" className="text-gray-600 hover:text-red-500">Favorites</Link>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">Logout</button>
          </div>
        ) : (
          <Link to="/login" className="bg-red-500 text-white px-4 py-1 rounded">Login</Link>
        )}
      </nav>

      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/" element={user ? <Home user={user} /> : <Login onLogin={handleLogin} />} />
        <Route path="/pokemon" element={user ? <PokemonList user={user} /> : <Login onLogin={handleLogin} />} />
        <Route path="/pokemon/:id" element={user ? <PokemonDetail /> : <Login onLogin={handleLogin} />} />
        <Route path="/favorites" element={user ? <Favorites user={user} /> : <Login onLogin={handleLogin} />} />
      </Routes>
    </div>
  )
}

export default App