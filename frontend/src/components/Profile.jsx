import './Profile.css'

function Profile({ usuario, onLogout }) {
  const dataCriacao = new Date().toLocaleDateString('pt-BR')
  const iniciais = (usuario?.first_name || usuario?.email || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar">
          <div className="avatar-circle">{iniciais}</div>
        </div>

        <div className="profile-info">
          <h2>{usuario?.first_name || 'Usuário'}</h2>
          <p className="profile-email">{usuario?.email}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">ID do Usuário</span>
            <span className="stat-value">#{usuario?.id}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Membro desde</span>
            <span className="stat-value">{dataCriacao}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button className="action-btn edit-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
            Editar Perfil
          </button>
          <button onClick={onLogout} className="action-btn logout-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sair
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3>Configurações</h3>
        <div className="setting-item">
          <span>Notificações por email</span>
          <input type="checkbox" defaultChecked className="toggle-switch" />
        </div>
        <div className="setting-item">
          <span>Alarmes habilitados</span>
          <input type="checkbox" defaultChecked className="toggle-switch" />
        </div>
      </div>
    </div>
  )
}

export default Profile
