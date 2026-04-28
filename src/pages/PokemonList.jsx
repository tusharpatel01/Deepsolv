import  { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PokemonList({ user }) {
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [allTypes, setAllTypes] = useState([])
  const [favorites, setFavorites] = useState([])  





  useEffect(() => {
    const key = `fav_${user.email}`
    const saved = localStorage.getItem(key)
    if (saved) setFavorites(JSON.parse(saved))
  }, [user])

  useEffect(() => {
    const key = `fav_${user.email}`
    localStorage.setItem(key, JSON.stringify(favorites))
  }, [favorites, user])

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type?limit=20')
      .then(res => res.json())
      .then(data => {
        const types = data.results.map(t => t.name)
        setAllTypes(types)
      })
  }, [])
  useEffect(() => {
    if (selectedType) {
      setLoading(true)
      fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
        .then(res => res.json())
        .then(data => {
          const pokemonList = data.pokemon.slice(0, 50).map((p, index) => {
            const urlParts = p.pokemon.url.split('/')
            const id = parseInt(urlParts[urlParts.length - 2])
            return {
              id: id,
              name: p.pokemon.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            }
          })
          setPokemon(pokemonList)
          setLoading(false)
        })
    } else {
      setLoading(true)
      fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(page-1)*20}`)
        .then(res => res.json())
        .then(data => {
          const promises = data.results.map(async (p, i) => {
            const id = (page-1)*20 + i + 1
            return {
              id: id,
              name: p.name,
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
            }
          })
          Promise.all(promises).then(setPokemon)
          setLoading(false)
        })
    }
  }, [page, selectedType])

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(f => f !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  const filteredPokemon = pokemon.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const handlePokemonClick = (id) => {
    navigate(`/pokemon/${id}`)
  }

  if (loading) return <div className="text-center py-20">Loading Pokemon</div>

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-4">Pokemon List</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text" placeholder="Search" className="flex-1 p-2 border rounded"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        <select
          className="md:w-48 p-2 border rounded" value={selectedType}
          onChange={(e) => {
            setSelectedType(e.target.value)
            setPage(1)
          }}
        >
          <option value="">All Types</option>
          {allTypes.map(type => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredPokemon.map(p => (
          <div 
            key={p.id} 
            className="bg-white rounded-lg shadow p-4 text-center relative cursor-pointer hover:shadow-lg transition"
            onClick={() => handlePokemonClick(p.id)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
 toggleFavorite(p.id)
              }}
              className="absolute top-2 right-2 text-2xl"
            >
              {favorites.includes(p.id) ? '❤️' : '🤍'}
            </button>
            <img src={p.image} alt={p.name} className="w-32 h-32 mx-auto" />
            <p className="font-semibold capitalize mt-2">{p.id} <p></p>{p.name}</p>
          </div>
        ))}
      </div>
      {!selectedType && (
        <div className="flex justify-between mt-6">
          <button 
            onClick={() => setPage(p => Math.max(1, p-1))} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button 
            onClick={() => setPage(p => p+1)}  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default PokemonList