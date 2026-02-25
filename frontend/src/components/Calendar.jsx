import { useState } from 'react'
import './Calendar.css'

function Calendar({ tarefas }) {
  const [mesAtual, setMesAtual] = useState(new Date())

  const getDiasDoMes = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getPrimeiroDia = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getNomeMes = (date) => {
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']
    return meses[date.getMonth()]
  }

  const tarefasPorDia = (dia) => {
    const dateStr = `${mesAtual.getFullYear()}-${String(mesAtual.getMonth() + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`
    return tarefas.filter(t => t.data_agendada === dateStr)
  }

  const renderCalendario = () => {
    const diasDoMes = getDiasDoMes(mesAtual)
    const primeiroDia = getPrimeiroDia(mesAtual)
    const dias = []

    // Dias vazios do mês anterior
    for (let i = 0; i < primeiroDia; i++) {
      dias.push(<div key={`vazio-${i}`} className="day empty"></div>)
    }

    // Dias do mês
    for (let dia = 1; dia <= diasDoMes; dia++) {
      const tarefasDay = tarefasPorDia(dia)
      dias.push(
        <div key={dia} className="day">
          <div className="day-number">{dia}</div>
          <div className="day-tasks">
            {tarefasDay.length > 0 && (
              <div className="task-indicator">
                <span className="task-count">{tarefasDay.length}</span>
                {tarefasDay.some(t => !t.concluida) && <span className="pending-dot"></span>}
              </div>
            )}
          </div>
        </div>
      )
    }

    return dias
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button 
          className="nav-btn"
          onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1))}
        >
          ←
        </button>
        <h2>{getNomeMes(mesAtual)} {mesAtual.getFullYear()}</h2>
        <button 
          className="nav-btn"
          onClick={() => setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1))}
        >
          →
        </button>
      </div>

      <div className="calendar-weekdays">
        <div className="weekday">Seg</div>
        <div className="weekday">Ter</div>
        <div className="weekday">Qua</div>
        <div className="weekday">Qui</div>
        <div className="weekday">Sex</div>
        <div className="weekday">Sab</div>
        <div className="weekday">Dom</div>
      </div>

      <div className="calendar-grid">
        {renderCalendario()}
      </div>
    </div>
  )
}

export default Calendar
