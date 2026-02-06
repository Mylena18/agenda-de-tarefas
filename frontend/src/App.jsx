import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'
import Login from './components/Login'
import TarefaForm from './components/TarefaForm'
import TarefaList from './components/TarefaList'

const API_BASE_URL = 'http://127.0.0.1:8000/api/'

function App() {
  const [usuario, setUsuario] = useState(null)
  const [token, setToken] = useState(null)
  const [tarefas, setTarefas] = useState([])
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(null)

  // Verificar se há token armazenado
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUsuario(JSON.parse(savedUser))
      axios.defaults.headers.common['Authorization'] = `Token ${savedToken}`
      carregarTarefas(savedToken)
    }
  }, [])

  const carregarTarefas = async (authToken) => {
    try {
      setCarregando(true)
      const res = await axios.get(`${API_BASE_URL}tarefas/`, {
        headers: { Authorization: `Token ${authToken}` }
      })
      setTarefas(res.data)
      setErro(null)
    } catch (err) {
      setErro('Erro ao carregar tarefas')
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }

  const adicionarTarefa = async (titulo, descricao, data, hora) => {
    try {
      const res = await axios.post(`${API_BASE_URL}tarefas/`, {
        titulo,
        descricao,
        data_agendada: data || null,
        hora_agendada: hora || null,
        concluida: false
      })
      setTarefas([...tarefas, res.data])
      setErro(null)
    } catch (err) {
      setErro('Erro ao adicionar tarefa')
      console.error(err)
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

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="fixed inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/80 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/50 border-b border-white/10 shadow-2xl">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="p-2.5 sm:p-3 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-500 rounded-xl sm:rounded-2xl shadow-lg">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <path d="M16 2v4M8 2v4M3 10h18"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                    Agenda
                  </h1>
                  <p className="text-xs sm:text-sm text-purple-200/70">Bem-vindo, {usuario?.username}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg font-semibold text-sm bg-red-500/30 text-red-200 border border-red-400/50 hover:bg-red-500/50 transition-all duration-300"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
          {erro && (
            <div className="mb-6 sm:mb-8 p-4 sm:p-6 bg-red-500/20 border border-red-500/50 rounded-xl sm:rounded-2xl text-red-200 backdrop-blur-sm animate-slideUp">
              <div className="flex items-start gap-3 sm:gap-4">
                <span className="text-xl sm:text-2xl flex-shrink-0 mt-0.5">!</span>
                <div>
                  <h3 className="font-semibold sm:text-lg">{erro}</h3>
                </div>
              </div>
            </div>
          )}

          <TarefaForm onAdicionar={adicionarTarefa} />

          {carregando ? (
            <div className="text-center py-12 sm:py-24 mt-8 sm:mt-12">
              <div className="inline-block">
                <div className="text-5xl sm:text-7xl mb-4">↻</div>
              </div>
              <p className="text-purple-200/80 text-sm sm:text-lg mt-4">Carregando suas tarefas...</p>
            </div>
          ) : tarefas.length === 0 ? (
            <div className="text-center py-12 sm:py-24 mt-8 sm:mt-12">
              <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-float">✓</div>
              <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2 sm:mb-4">Tudo pronto!</h2>
              <p className="text-purple-200/80 text-sm sm:text-lg max-w-md mx-auto leading-relaxed">
                Você não tem tarefas pendentes. Crie uma nova para começar!
              </p>
            </div>
          ) : (
            <div className="mt-8 sm:mt-12 animate-slideUp">
              <TarefaList
                tarefas={tarefas}
                tarefasPendentes={tarefasPendentes}
                tarefasConcluidas={tarefasConcluidas}
                onAtualizar={atualizarTarefa}
                onDeletar={deletarTarefa}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="relative z-10 mt-auto py-6 sm:py-8 px-4 sm:px-6 border-t border-white/10">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-xs sm:text-sm text-purple-300/60">
              Agenda pessoal • Desenvolvido para melhorar sua produtividade
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
