import { useGoogleLogin } from '@react-oauth/google'

function Login({ onLogin }) {
  
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
      })
      const userInfo = await res.json()
      
      onLogin({
        name: userInfo.name,
        email: userInfo.email,
        picture: userInfo.picture
      })
    }
  })

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-2">Deepsolv</h1>
        <p className="text-gray-500 mb-6"> Please Login</p>
        <button
          onClick={() => handleGoogleLogin()}
          className="flex items-center gap-3 border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
      </div>
    </div>
  )
}

export default Login