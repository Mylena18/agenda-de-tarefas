import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = isLogin 
        ? 'http://127.0.0.1:8000/api/auth/login/'
        : 'http://127.0.0.1:8000/api/auth/register/'

      const response = await axios.post(endpoint, {
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        onLoginSuccess(response.data.user, response.data.token)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao processar requisição')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-gradient-bg"></div>
      
      <div className="login-content">
        <div className="login-card">
          {/* Logo */}
          <div className="login-header">
            <div className="login-logo">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="12" width="32" height="24" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M14 18L20 24L30 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1>{isLogin ? 'Bem-vindo' : 'Criar Conta'}</h1>
            <p>{isLogin ? 'Gerencie suas tarefas com elegância' : 'Comece sua jornada produtiva'}</p>
          </div>

          {/* Erro */}
          {error && (
            <div className="login-error">
              <span className="error-icon">⚠</span>
              <p>{error}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuário</label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="seu_usuario"
                required
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-btn"
              disabled={loading}
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Registrar')}
            </button>
          </form>

          {/* Toggle */}
          <div className="login-footer">
            <p>
              {isLogin ? 'Não tem conta?' : 'Já tem conta?'}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setError(null)
                  setFormData({ username: '', email: '', password: '' })
                }}
                className="toggle-btn"
              >
                {isLogin ? 'Registre-se' : 'Entre'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
