import PropTypes from 'prop-types';
import Head from 'next/head';

const Login = ({ 
  form,
  error,
  innerRef,
  onChange,
  onSubmit,
  onKeyPress,
  onErrorReset
}) => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    padding: '1.5rem',
    fontFamily: "'DM Sans', sans-serif"
  }}>
    <Head>
      <title>Telebey Open5GS - Sign In</title>
    </Head>
        <div style={{ width: '100%', maxWidth: '24rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} id="nprogress-base-login">
      
      {/* Brand Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '1rem',
          backgroundColor: '#1e6fd9',
          color: '#ffffff',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 20px rgba(30, 111, 217, 0.25)',
          marginBottom: '0.75rem'
        }}>
          <svg style={{ width: '2rem', height: '2rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
          </svg>
        </div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#0f172a',
          margin: 0
        }}>Telebey Open5GS</h1>
        <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
          5G Core Network Manager
        </p>
      </div>

      {/* Card */}
      <div className="telebey-card" style={{ padding: '2rem' }}>
        
        {/* Error Alert */}
        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#991b1b',
            fontSize: '0.85rem',
            marginBottom: '1.25rem'
          }}>
            <svg style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0, marginTop: '0.1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div style={{ flex: 1 }}>{error.message || 'Invalid username or password'}</div>
            <button onClick={onErrorReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}>×</button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="telebey-label">Username</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="telebey-input"
              value={form.username}
              onChange={onChange}
              onKeyPress={onKeyPress}
              ref={(comp) => innerRef(comp)}
              autoFocus
            />
          </div>

          <div>
            <label className="telebey-label">Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="telebey-input"
              value={form.password}
              onChange={onChange}
              onKeyPress={onKeyPress}
            />
          </div>

          <button
            type="button"
            className="telebey-btn telebey-btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', fontSize: '0.95rem' }}
            onClick={onSubmit}
          >
            Sign In
          </button>
        </div>
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8' }}>
        © 2026 Telebey Open5GS • 5G Core Administration
      </p>
    </div>
  </div>
);

Login.propTypes = {
  form: PropTypes.object,
  error: PropTypes.object,
  innerRef: PropTypes.func,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func,
  onKeyPress: PropTypes.func,
  onErrorReset: PropTypes.func
};

export default Login;
