# Modern Login App with Google & GitHub OAuth


### Frontend
- **React 18** with TypeScript
- **Vite** - Next generation frontend tooling
- **@react-oauth/google** - Official Google OAuth library
- **Axios** - HTTP client
- **jwt-decode** - JWT token decoder

### Backend
- **Express** with TypeScript
- **Node.js**
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment configuration

## Prerequisites

Before you begin, ensure you have:
- Node.js (v16 or higher)
- npm or yarn
- Google OAuth Client ID
- GitHub OAuth App credentials

## Setup Instructions

### 1. Clone and Install

```bash
# Frontend
cd login-app
npm install

# Backend
cd backend
npm install
```

### 2. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **Google Identity Services**
4. Go to **APIs & Services** → **Credentials**
5. Create **OAuth Client ID**
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:5173`
   - Authorized redirect URIs: `http://localhost:5173`
6. Copy the **Client ID**

### 3. Configure GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in the details:
   - Application name: `Login App`
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173`
4. Click **Register application**
5. Copy the **Client ID**
6. Generate a **Client Secret** and copy it

### 4. Configure Environment Variables

#### Frontend (.env)
Create a `.env` file in the root directory:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
VITE_REDIRECT_URI=http://localhost:5173
```

#### Backend (backend/.env)
Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

### 5. Run the Application

#### Terminal 1 - Frontend
```bash
npm run dev
```
Frontend will run on: `http://localhost:5173`

#### Terminal 2 - Backend
```bash
cd backend
npm run dev
```
Backend will run on: `http://localhost:3001`

## How It Works

### Google OAuth Flow
1. User clicks "Sign in with Google"
2. Google returns a JWT credential
3. Frontend decodes the JWT token (no backend required)
4. User profile is displayed and saved to localStorage

### GitHub OAuth Flow
1. User clicks "Continue with GitHub"
2. App redirects to GitHub authorization page
3. GitHub redirects back with an authorization code
4. Frontend sends code to backend
5. Backend exchanges code for access token with GitHub
6. Backend returns access token to frontend
7. Frontend fetches user data from GitHub API
8. User profile is displayed and saved to localStorage

