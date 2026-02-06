import { useState } from 'react'
import './TarefaForm.css'

function TarefaForm({ onAdicionar }) {
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!titulo.trim()) return

    setLoading(true)
    try {
      await onAdicionar(titulo, descricao, data, hora)
      setTitulo('')
      setDescricao('')
      setData('')
      setHora('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tarefa-form-container animate-slideUp">
      <div className="form-header">
        <h2 className="form-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Nova Tarefa
        </h2>
        <p className="form-subtitle">Adicione uma nova tarefa à sua agenda</p>
      </div>

      <form onSubmit={handleSubmit} className="form-content">
        {/* Título */}
        <div className="form-group">
          <label htmlFor="titulo">Título *</label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Qual é sua próxima tarefa?"
            maxLength="100"
            disabled={loading}
            required
          />
          <span className="char-count">{titulo.length}/100</span>
        </div>

        {/* Descrição */}
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Adicione detalhes sobre a tarefa (opcional)"
            maxLength="500"
            rows="3"
            disabled={loading}
          />
          <span className="char-count">{descricao.length}/500</span>
        </div>

        {/* Data e Hora */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="data">Data</label>
            <input
              id="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="hora">Hora</label>
            <input
              id="hora"
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Botão Submit */}
        <button 
          type="submit" 
          className="form-submit-btn"
          disabled={loading || !titulo.trim()}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          {loading ? 'Adicionando...' : 'Adicionar Tarefa'}
        </button>
      </form>
    </div>
  )
}

export default TarefaForm
