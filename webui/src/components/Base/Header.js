import PropTypes from 'prop-types';

const Header = ({ onLogoutRequest, apigateConnected }) => (
  <header className="telebey-header">
    <div className="telebey-header-status">
      <span className="telebey-status-dot"></span>
      <span>Connected to Telebey Open5GS Core</span>
      <span className={`telebey-badge ${apigateConnected ? 'telebey-badge-success' : 'telebey-badge-warning'}`} style={{ marginLeft: '0.75rem' }}>
        ApiGate {apigateConnected ? 'online' : 'offline'}
      </span>
    </div>
    <div className="telebey-user-menu">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div className="telebey-avatar">A</div>
        <div style={{ fontSize: '0.85rem' }}>
          <div style={{ fontWeight: 600, color: '#0f172a' }}>Admin</div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Telebey Open5GS Admin</div>
        </div>
      </div>
      <button 
        className="telebey-btn telebey-btn-secondary telebey-btn-sm" 
        onClick={onLogoutRequest}
        title="Sign out of Telebey 5G Core"
      >
        <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span>Logout</span>
      </button>
    </div>
  </header>
);

Header.propTypes = {
  onLogoutRequest: PropTypes.func.isRequired,
  apigateConnected: PropTypes.bool
};

export default Header;
