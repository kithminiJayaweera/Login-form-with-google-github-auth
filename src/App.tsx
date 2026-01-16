/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  image: string;
}

interface GoogleJWT {
  name: string;
  email: string;
  picture: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Google Login Success
  const handleGoogleSuccess = (credentialResponse: any) => {
    try {
      const decoded = jwtDecode<GoogleJWT>(credentialResponse.credential);
      const userData: User = {
        name: decoded.name,
        email: decoded.email,
        image: decoded.picture,
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setError('');
    } catch (err) {
      setError('Failed to decode Google token');
      console.error(err);
    }
  };

  // GitHub Login
  const handleGithubLogin = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const redirectUri = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173';
    window.location.assign(
      `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`
    );
  };

  // Read GitHub Code from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (code) {
      fetchGithubUser(code);
      // Clean URL after getting code
      window.history.replaceState({}, document.title, '/');
    }

    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const fetchGithubUser = async (code: string) => {
    setLoading(true);
    setError('');
    
    try {
      // Exchange code for access token via backend
      const tokenResponse = await axios.post(
        'http://localhost:3001/api/github/callback',
        { code },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { access_token } = tokenResponse.data;

      // Fetch user data from GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const userData: User = {
        name: userResponse.data.name || userResponse.data.login,
        email: userResponse.data.email || 'No public email',
        image: userResponse.data.avatar_url,
      };

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err: any) {
      setError(err.response?.data?.error || 'GitHub login failed. Make sure backend is running.');
      console.error('GitHub login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    setError('');
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-[#004c09] to-[#92efb9] p-5">
      <div className='w-2xl bg-white rounded-3xl'>
        <h1 className="text-4xl font-bold text-gray-800 text-center mt-5 mb-2">Modern Login App</h1>
        <p className="text-gray-600 text-center mb-8 text-sm">Secure authentication with Google & GitHub</p>
        <div className=" px-10 py-20 shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full animate-[slideIn_0.3s_ease-out]">
        

        {loading && <div className="text-center text-[#01422e] font-medium py-2">Loading...</div>}

        {!user ? (
          <div className="flex flex-col gap-5">
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError('Google Login Failed')}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
              />
            </div>

            <div className="flex items-center text-center my-2">
              <div className="flex-1 border-b border-gray-300"></div>
              <span className="px-2 text-gray-500 text-sm font-medium">OR</span>
              <div className="flex-1 border-b border-gray-300"></div>
            </div>

            <button 
              className="flex items-center justify-center gap-2 bg-[#24292e] text-white border-none py-3 px-6 rounded-lg text-base font-medium cursor-pointer transition-all hover:bg-[#1a1e22] hover:shadow-[0_5px_15px_rgba(0,0,0,0.2)] active:translate-y-0" 
              onClick={handleGithubLogin}
            >
              <svg height="20" width="20" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              Continue with GitHub
            </button>

            {error && <div className="bg-[#fee] text-[#c33] p-3 rounded-lg border-l-4 border-[#c33] text-sm">{error}</div>}
          </div>
        ) : (
          <div className="text-center animate-[fadeIn_0.3s_ease-out]">
            <img src={user.image} alt={user.name} className="w-32 h-32 rounded-full border-4 border-[#667eea] mb-5 object-cover mx-auto" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">{user.name}</h2>
            <p className="text-gray-600 mb-8">{user.email}</p>
            <button
              className="bg-[#667eea] text-white border-none py-3 px-10 rounded-lg text-base font-medium cursor-pointer transition-all hover:bg-[#5568d3] hover:-translate-y-0.5 hover:shadow-[0_5px_15px_rgba(102,126,234,0.4)] active:translate-y-0" 
              onClick={logout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
      </div>

    </div>
  );
}

export default App;
