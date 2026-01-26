import { useState } from 'react'
import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(username, password)

    if (result.success) {
      navigate('/admin')
    } else {
      setError(result.message)
    }

    setIsLoading(false)
  }

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px 30px',
        textAlign: 'center'
      }}>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit} style={{ marginTop: '30px' }}>
          <label style={{
            display: 'block',
            textAlign: 'left',
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter admin username"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--gray-medium)',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '16px'
            }}
            required
          />

          <label style={{
            display: 'block',
            textAlign: 'left',
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid var(--gray-medium)',
              borderRadius: '8px',
              fontSize: '16px',
              marginBottom: '16px'
            }}
            required
          />

          {error && (
            <div style={{
              color: '#ef4444',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  )
}
