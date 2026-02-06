import TarefaItem from './TarefaItem'
import './TarefaList.css'

function TarefaList({ tarefas, tarefasPendentes, tarefasConcluidas, onAtualizar, onDeletar }) {
  return (
    <div className="tarefas-container">
      {/* Tarefas Pendentes */}
      <section className="tarefas-section animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="section-header">
          <div className="section-title-wrapper">
            <div className="section-icon pending">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
              </svg>
            </div>
            <h2 className="section-title">Tarefas Pendentes</h2>
            <span className="section-badge pending-badge">{tarefasPendentes.length}</span>
          </div>
          <div className="section-line"></div>
        </div>
        
        {tarefasPendentes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✓</div>
            <p className="empty-text">Nenhuma tarefa pendente!</p>
          </div>
        ) : (
          <div className="tarefas-grid">
            {tarefasPendentes.map((tarefa, index) => (
              <div key={tarefa.id} style={{ animationDelay: `${index * 0.05}s` }} className="animate-slideUp">
                <TarefaItem
                  tarefa={tarefa}
                  onAtualizar={onAtualizar}
                  onDeletar={onDeletar}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Tarefas Concluídas */}
      {tarefasConcluidas.length > 0 && (
        <section className="tarefas-section animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="section-header">
            <div className="section-title-wrapper">
              <div className="section-icon completed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h2 className="section-title">Concluídas</h2>
              <span className="section-badge completed-badge">{tarefasConcluidas.length}</span>
            </div>
            <div className="section-line"></div>
          </div>
          <div className="tarefas-grid">
            {tarefasConcluidas.map((tarefa, index) => (
              <div key={tarefa.id} style={{ animationDelay: `${0.2 + index * 0.05}s` }} className="animate-slideUp">
                <TarefaItem
                  tarefa={tarefa}
                  onAtualizar={onAtualizar}
                  onDeletar={onDeletar}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Estatísticas */}
      {tarefas.length > 0 && (
        <section className="stats-section animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="stats-title">Seu Progresso</div>
          <div className="stats-grid">
            <div className="stat-card total">
              <div className="stat-value">{tarefas.length}</div>
              <div className="stat-label">Total de Tarefas</div>
            </div>
            <div className="stat-card completed-stat">
              <div className="stat-value">{tarefasConcluidas.length}</div>
              <div className="stat-label">Concluídas</div>
            </div>
          </div>
          
          {/* Barra de Progresso */}
          <div className="progress-section">
            <div className="progress-header">
              <p className="progress-label">Taxa de Conclusão</p>
              <p className="progress-percentage">
                {Math.round((tarefasConcluidas.length / tarefas.length) * 100)}%
              </p>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(tarefasConcluidas.length / tarefas.length) * 100}%`
                }}
              ></div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default TarefaList
