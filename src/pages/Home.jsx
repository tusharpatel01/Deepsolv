function Home({ user }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-lg shadow p-8">
        <img 
          src={user.picture} 
          alt={user.name} 
          className="w-20 h-20 rounded-full mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
        <div className="grid md:grid-cols-2 gap-4 mt-8">
          <a href="/pokemon" className="bg-red-500 text-white py-3 rounded-lg">Browse Pokemon</a>
          <a href="/favorites" className="bg-gray-500 text-white py-3 rounded-lg">My Favorites</a>
        </div>
      </div>
    </div>
  )
}

export default Home 