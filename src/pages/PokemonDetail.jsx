import  { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function PokemonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => res.json())
      .then(data => {
        fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
          .then(res => res.json())
          .then(speciesData => {
            const description = speciesData.flavor_text_entries.find(
              entry => entry.language.name === 'en'
            )?.flavor_text || 'No data available.'
            
            setPokemon({
              id: data.id,
              name: data.name,
              height: data.height / 10,
              weight: data.weight / 10,
              types: data.types.map(t => t.type.name),
              abilities: data.abilities.map(a => a.ability.name),
              stats: {
                hp: data.stats.find(s => s.stat.name === 'hp')?.base_stat || 0,
                attack: data.stats.find(s => s.stat.name === 'attack')?.base_stat || 0,
                defense: data.stats.find(s => s.stat.name === 'defense')?.base_stat || 0,
                specialAttack: data.stats.find(s => s.stat.name === 'special-attack')?.base_stat || 0,
                specialDefense: data.stats.find(s => s.stat.name === 'special-defense')?.base_stat || 0,
                speed: data.stats.find(s => s.stat.name === 'speed')?.base_stat || 0,
              },
              image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
              description: description.replace(/[\f\n\r\t]/g, ' ').trim()
            })
            setLoading(false)
          })
      })
      .catch(error => {
        console.error('Error:', error)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4">Loading Pokemon features</p>
        </div>
      </div>
    )
  }

  if (!pokemon) {
    return (
      <div className="text-center py-20">
        <p>Pokemon not found</p>
        <button onClick={() => navigate('/pokemon')} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
          Back to List
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="mb-6 text-gray-600 hover:text-gray-800"
      >
        ← Back to List
      </button>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold capitalize">{pokemon.name}</h1>
              <p className="text-red-100 mt-1">{String(pokemon.id).padStart(1, '0')}</p>
            </div>
            <img src={pokemon.image} alt={pokemon.name} className="w-32 h-32 object-contain" />
          </div>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-700 italic">{pokemon.description}</p>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <span className="text-sm text-gray-600">Height</span>
              <p className="text-xl font-semibold">{pokemon.height} m</p>
            </div>
            <div className="bg-gray-100 p-3 rounded-lg text-center">
              <span className="text-sm text-gray-600">Weight</span>
              <p className="text-xl font-semibold">{pokemon.weight} kg</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Types</h2>
            <div className="flex gap-2">
              {pokemon.types.map(type => (
                <span 
                  key={type} 
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-medium capitalize"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Abilities</h2>
            <div className="flex gap-2 flex-wrap">
              {pokemon.abilities.map(ability => (
                <span 
                  key={ability} 
                  className="px-4 py-2 bg-gray-200 rounded-full capitalize"
                >
                  {ability.replace('-', ' ')}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Base Stats</h2>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">HP</span>
                <span>{pokemon.stats.hp}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(pokemon.stats.hp / 255) * 100}%` }}></div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Attack</span>
                <span>{pokemon.stats.attack}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(pokemon.stats.attack / 255) * 100}%` }}></div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Defense</span>
                <span>{pokemon.stats.defense}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(pokemon.stats.defense / 255) * 100}%` }}></div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Sp. Attack</span>
                <span>{pokemon.stats.specialAttack}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(pokemon.stats.specialAttack / 255) * 100}%` }}></div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Sp. Defense</span>
                <span>{pokemon.stats.specialDefense}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(pokemon.stats.specialDefense / 255) * 100}%` }}></div>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">Speed</span>
                <span>{pokemon.stats.speed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-pink-500 h-2 rounded-full" style={{ width: `${(pokemon.stats.speed / 255) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PokemonDetail