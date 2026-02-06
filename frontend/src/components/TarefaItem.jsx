import { useState } from 'react'
import './TarefaItem.css'

function TarefaItem({ tarefa, onAtualizar, onDeletar }) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggle = () => {
    onAtualizar(tarefa.id, { concluida: !tarefa.concluida })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    await onDeletar(tarefa.id)
    setIsDeleting(false)
  }

  const formatarData = (data) => {
    if (!data) return ''
    const date = new Date(data)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    })
  }

  const formatarHora = (hora) => {
    if (!hora) return ''
    return hora.substring(0, 5)
  }

  return (
    <div className={`tarefa-card ${tarefa.concluida ? 'completed' : 'pending'}`}>
      <div className="card-content">
        {/* Checkbox */}
        <div className="card-checkbox-wrapper">
          <input
            type="checkbox"
            checked={tarefa.concluida}
            onChange={handleToggle}
            className="card-checkbox"
            id={`tarefa-${tarefa.id}`}
          />
          <label htmlFor={`tarefa-${tarefa.id}`} className="checkbox-label"></label>
        </div>

        {/* Texto */}
        <div className="card-text">
          <h3 className={`card-title ${tarefa.concluida ? 'line-through' : ''}`}>
            {tarefa.titulo}
          </h3>

          {tarefa.descricao && (
            <p className="card-description">{tarefa.descricao}</p>
          )}

          {/* Data e Hora */}
          <div className="card-meta">
            {(tarefa.data_agendada || tarefa.hora_agendada) && (
              <div className="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <path d="M16 2v4M8 2v4M3 10h18"/>
                </svg>
                <span>
                  {formatarData(tarefa.data_agendada)}
                  {tarefa.hora_agendada && ` • ${formatarHora(tarefa.hora_agendada)}`}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="card-status">
            {tarefa.concluida ? (
              <span className="status-badge completed-status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Concluída
              </span>
            ) : (
              <span className="status-badge pending-status">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Pendente
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="card-delete-btn"
        title="Deletar tarefa"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  )
}

export default TarefaItem
