import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Login from './components/Login'
import TarefaForm from './components/TarefaForm'
import TarefaList from './components/TarefaList'
import Calendar from './components/Calendar'
import Profile from './components/Profile'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [adicionandoTarefa, setAdicionandoTarefa] = useState(false)
  const [erro, setErro] = useState(null)
  const [abaAtiva, setAbaAtiva] = useState('home') // home, calendar, profile

  // Verificar se há token armazenado
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUsuario(JSON.parse(savedUser))
      // Configurar axios com token
      axios.defaults.headers.common['Authorization'] = `Token ${savedToken}`
      axios.defaults.headers.common['Content-Type'] = 'application/json'
      carregarTarefas(savedToken)
    }
  }, [])

  // Log quando a aba ativa muda
  useEffect(() => {
    console.log('📍 Aba ativa mudou para:', abaAtiva)
  }, [abaAtiva])

  const carregarTarefas = async (authToken) => {
    try {
      setCarregando(true)
      setErro(null)
      const res = await axios.get(`${API_BASE_URL}tarefas/`, {
        headers: { Authorization: `Token ${authToken}` }
      })
      console.log('Tarefas carregadas:', res.data)
      setTarefas(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      console.error('Erro ao carregar tarefas:', err.response?.status, err.response?.data, err.message)
      setErro('Erro ao carregar tarefas')
    } finally {
      setCarregando(false)
    }
  }

  const adicionarTarefa = async (titulo, descricao, data, hora, alarmeAtivo) => {
    try {
      console.log('🚀 Iniciando adição de tarefa...', { titulo, descricao, data, hora, alarmeAtivo })
      
      setAdicionandoTarefa(true)
      
      const payload = {
        titulo,
        descricao,
        data_agendada: data || null,
        hora_agendada: hora || null,
        alarme_ativo: alarmeAtivo || false,
        concluida: false
      }
      
      console.log('📤 Enviando payload:', payload)
      
      const res = await axios.post(`${API_BASE_URL}tarefas/`, payload)
      
      console.log('✅ Tarefa adicionada com sucesso:', res.data)
      setTarefas([...tarefas, res.data])
      setErro(null)
      setAdicionandoTarefa(false)
      return res.data
    } catch (err) {
      console.error('❌ Erro ao adicionar tarefa:')
      console.error('   Status:', err.response?.status)
      console.error('   Data:', err.response?.data)
      console.error('   Message:', err.message)
      
      const errorMsg = err.response?.data?.detail || 
                       err.response?.data?.error ||
                       err.response?.data?.titulo?.[0] || 
                       'Erro ao adicionar tarefa'
      
      console.error('📢 Mensagem de erro:', errorMsg)
      setErro(errorMsg)
      setAdicionandoTarefa(false)
      
      // Manter erro visível por mais tempo
      setTimeout(() => {
        console.log('🔄 Limpando erro')
        setErro(null)
      }, 10000)
    }
  }

  const atualizarTarefa = async (id, dados) => {
    try {
      const res = await axios.patch(`${API_BASE_URL}tarefas/${id}/`, dados)
      setTarefas(tarefas.map(t => t.id === id ? res.data : t))
      setErro(null)
    } catch (err) {
      setErro('Erro ao atualizar tarefa')
      console.error(err)
    }
  }

  const deletarTarefa = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}tarefas/${id}/`)
      setTarefas(tarefas.filter(t => t.id !== id))
      setErro(null)
    } catch (err) {
      setErro('Erro ao deletar tarefa')
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUsuario(null)
    setTarefas([])
    delete axios.defaults.headers.common['Authorization']
  }

  const handleLoginSuccess = (user, authToken) => {
    setUsuario(user)
    setToken(authToken)
    axios.defaults.headers.common['Authorization'] = `Token ${authToken}`
    carregarTarefas(authToken)
  }

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  const tarefasPendentes = tarefas.filter(t => !t.concluida)
  const tarefasConcluidas = tarefas.filter(t => t.concluida)
  
  // Tarefas do dia
  const hoje = new Date().toISOString().split('T')[0]
  const tarefasHoje = tarefas.filter(t => t.data_agendada === hoje && !t.concluida)

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-brand">
            <div className="brand-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div>
              <h1>Agenda</h1>
              <p>Bem-vindo, {usuario?.first_name || usuario?.email}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">Sair</button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="app-tabs">
        <button 
          className={`tab-btn ${abaAtiva === 'home' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('home')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Início
        </button>
        <button 
          className={`tab-btn ${abaAtiva === 'calendar' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('calendar')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          Calendário
        </button>
        <button 
          className={`tab-btn ${abaAtiva === 'profile' ? 'active' : ''}`}
          onClick={() => setAbaAtiva('profile')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          Perfil
        </button>
      </nav>

      {/* Main Content */}
      <main className="app-main">
        {erro && (
          <div className="error-banner">
            <span>⚠</span>
            <p>{erro}</p>
          </div>
        )}

        {abaAtiva === 'home' && (
          <div className="tab-content">
            <TarefaForm onAdicionar={adicionarTarefa} />
            
            {carregando ? (
              <div className="loading-state">
                <p>Carregando suas tarefas...</p>
              </div>
            ) : tarefasHoje.length > 0 ? (
              <div className="today-section">
                <h2>Tarefas para hoje</h2>
                <div className="today-tasks">
                  {tarefasHoje.map(t => (
                    <div key={t.id} className="today-item">
                      <input 
                        type="checkbox" 
                        checked={t.concluida}
                        onChange={() => atualizarTarefa(t.id, { concluida: !t.concluida })}
                        className="task-checkbox"
                      />
                      <div className="task-info">
                        <h3>{t.titulo}</h3>
                        {t.hora_agendada && <p className="task-time">{t.hora_agendada}</p>}
                        {t.alarme_ativo && <span className="alarm-badge">Alarme</span>}
                      </div>
                      <button 
                        onClick={() => deletarTarefa(t.id)}
                        className="delete-btn"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h2>Nenhuma tarefa para hoje!</h2>
                <p>Todas as suas tarefas estão em dia</p>
              </div>
            )}

            {tarefasPendentes.length > 0 && (
              <div className="all-tasks-section">
                <h2>Todas as tarefas</h2>
                <TarefaList
                  tarefas={tarefas}
                  tarefasPendentes={tarefasPendentes}
                  tarefasConcluidas={tarefasConcluidas}
                  onAtualizar={atualizarTarefa}
                  onDeletar={deletarTarefa}
                />
              </div>
            )}
          </div>
        )}

        {abaAtiva === 'calendar' && (
          <div className="tab-content calendar-content">
            <Calendar tarefas={tarefas} />
          </div>
        )}

        {abaAtiva === 'profile' && (
          <div className="tab-content profile-content">
            <Profile usuario={usuario} onLogout={handleLogout} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Agenda pessoal • Desenvolvido para melhorar sua produtividade</p>
      </footer>    </div>
  )
}

export default App