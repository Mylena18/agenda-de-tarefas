import { useState } from 'react'
import axios from 'axios'
import './Login.css'

function Login({ onLoginSuccess, apiBaseUrl = 'http://127.0.0.1:8000/api/' }) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    password: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Email e senha são obrigatórios')
      return false
    }
    if (formData.password.length < 4) {
      setError('Senha deve ter pelo menos 4 caracteres')
      return false
    }
    if (!isLogin && !formData.first_name) {
      setError('Nome é obrigatório')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!validateForm()) return

    setLoading(true)

    try {
      const endpoint = isLogin 
        ? `${apiBaseUrl}auth/login/`
        : `${apiBaseUrl}auth/register/`

      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, first_name: formData.first_name }

      const response = await axios.post(endpoint, payload)

      if (response.data.token) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))
        onLoginSuccess(response.data.user, response.data.token)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Erro ao processar requisição'
      setError(errorMsg)
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
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="first_name">Nome</label>
                <input
                  id="first_name"
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Seu nome"
                  disabled={loading}
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="password">Senha (mínimo 4 caracteres)</label>
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
                  setFormData({ email: '', first_name: '', password: '' })
                }}
              >
                {isLogin ? 'Registrar' : 'Fazer Login'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
