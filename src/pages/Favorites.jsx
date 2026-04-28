import  { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Favorites({ user }) {
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [pokemonDetails, setPokemonDetails] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const key = `fav_${user.email}`
    const saved = localStorage.getItem(key)
    if (saved) {
      setFavorites(JSON.parse(saved))
    }
  }, [user])

  useEffect(() => {
    if (favorites.length === 0) {
      setPokemonDetails([])
      setLoading(false)
      return
    }

    setLoading(true)
    const fetchDetails = async () => {
      const promises = favorites.map(async (id) => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const data = await res.json()
        return {
          id: id,
          name: data.name,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
        }
      })
      const results = await Promise.all(promises)
      setPokemonDetails(results)
      setLoading(false)
    }
    fetchDetails()
  }, [favorites])

  const removeFavorite = (id) => {
    const newFavorites = favorites.filter(f => f !== id)
    setFavorites(newFavorites)
    const key = `fav_${user.email}`
    localStorage.setItem(key, JSON.stringify(newFavorites))
  }

  const handlePokemonClick = (id) => {
    navigate(`/pokemon/${id}`)
  }

  if (loading) return <div className="text-center py-20">Loading favorites</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">My Favorites</h1>
      
      {pokemonDetails.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500">No favorites yet. Go add some</p>
          <a href="/pokemon" className="inline-block mt-4 bg-red-500 text-white px-4 py-2 rounded">Browse Pokemon</a>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pokemonDetails.map(p => (
            <div 
              key={p.id} 
              className="bg-white rounded-lg shadow p-4 text-center relative cursor-pointer hover:shadow-lg transition"
              onClick={() => handlePokemonClick(p.id)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  removeFavorite(p.id)
                }}
                className="absolute top-2 right-2 text-xl"
              >
                x
              </button>
              <img src={p.image} alt={p.name} className="w-32 h-32 mx-auto" />
              <p className="font-semibold capitalize mt-2">{p.id} <p></p>{p.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites