import { Component } from 'react';
import axios from 'axios';
import Session from 'modules/auth/session';

function authHeaders() {
  const sessionData = new Session();
  const csrf = ((sessionData || {}).session || {}).csrfToken;
  const authToken = ((sessionData || {}).session || {}).authToken;
  const headers = { 'X-CSRF-TOKEN': csrf };
  if (authToken) {
    headers.Authorization = 'Bearer ' + authToken;
  }
  return headers;
}

class ApiGateContainer extends Component {
  state = {
    loading: true,
    error: null,
    status: null
  };

  componentDidMount() {
    this.refresh();
  }

  refresh = () => {
    this.setState({ loading: true, error: null });
    axios.get('/api/apigate/status', { headers: authHeaders() })
      .then((response) => {
        this.setState({ loading: false, status: response.data });
      })
      .catch((err) => {
        this.setState({
          loading: false,
          error: (err.response && err.response.data && err.response.data.message) || err.message || 'Unable to query ApiGate'
        });
      });
  }

  render() {
    const { loading, error, status } = this.state;
    const connected = status && status.connected;
    const plans = (status && status.plans && status.plans.items) || [];
    const sims = (status && status.sims && status.sims.items) || [];

    return (
      <div>
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>ApiGate Gateway</h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Northbound Telebey MVNO API connected from this Open5GS router dashboard.
            </p>
          </div>
          <button className="telebey-btn telebey-btn-secondary" onClick={this.refresh} disabled={loading}>
            {loading ? 'Checking…' : 'Refresh status'}
          </button>
        </div>

        {error && (
          <div className="telebey-card" style={{ marginBottom: '1.5rem', borderColor: '#fecaca', background: '#fef2f2' }}>
            <div className="telebey-card-body">{error}</div>
          </div>
        )}

        <div className="telebey-metrics-grid">
          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>Gateway Health</span>
            </div>
            <div className="telebey-metric-value" style={{ color: connected ? '#16a34a' : '#b91c1c' }}>
              {loading ? '…' : (connected ? 'Online' : 'Offline')}
            </div>
            <div className="telebey-metric-subtext">
              {status && status.health ? `${status.health.latencyMs} ms · HTTP ${status.health.status || 0}` : 'GET /health'}
            </div>
          </div>

          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>Commercial Plans</span>
            </div>
            <div className="telebey-metric-value">{status && status.plans ? status.plans.count : 0}</div>
            <div className="telebey-metric-subtext">GET /plans from ApiGate</div>
          </div>

          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>Provisioned SIMs</span>
            </div>
            <div className="telebey-metric-value">{status && status.sims ? status.sims.count : 0}</div>
            <div className="telebey-metric-subtext">GET /sim (service login)</div>
          </div>

          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>Service Auth</span>
            </div>
            <div className="telebey-metric-value" style={{ fontSize: '1.5rem' }}>
              {status && status.auth && status.auth.ok ? 'Ready' : (status && status.auth && status.auth.configured ? 'Failed' : 'Optional')}
            </div>
            <div className="telebey-metric-subtext">
              {status && status.auth ? `Source: ${status.auth.source}` : 'APIGATE_TOKEN or login'}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <div className="telebey-card">
            <div className="telebey-card-header">
              <div>
                <h3 className="telebey-card-title">Connection</h3>
                <div className="telebey-card-description">Environment and upstream endpoints</div>
              </div>
              <span className={`telebey-badge ${connected ? 'telebey-badge-success' : 'telebey-badge-danger'}`}>
                {connected ? 'Connected' : 'Not connected'}
              </span>
            </div>
            <div className="telebey-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span style={{ color: '#64748b' }}>ApiGate URL</span>
                <code>{status ? status.url : '…'}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span style={{ color: '#64748b' }}>Swagger</span>
                <a href={status ? status.docs : '#'} target="_blank" rel="noopener noreferrer">{status ? status.docs : ''}</a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <span style={{ color: '#64748b' }}>Source</span>
                <a href="https://github.com/TelebeyISP/ApiGate.git" target="_blank" rel="noopener noreferrer">TelebeyISP/ApiGate</a>
              </div>
              {status && status.health && status.health.error && (
                <div style={{ color: '#b91c1c' }}>{status.health.error}</div>
              )}
            </div>
          </div>

          <div className="telebey-card">
            <div className="telebey-card-header">
              <div>
                <h3 className="telebey-card-title">Data plans</h3>
                <div className="telebey-card-description">Bundles advertised by ApiGate</div>
              </div>
            </div>
            <div className="telebey-card-body">
              {plans.length === 0 && (
                <p style={{ color: '#64748b', margin: 0 }}>No plans returned. Start ApiGate and seed plans to populate this list.</p>
              )}
              {plans.length > 0 && (
                <table className="telebey-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Data</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan) => (
                      <tr key={plan.id || plan.name}>
                        <td>{plan.name}</td>
                        <td>{plan.dataLimitMb != null ? `${plan.dataLimitMb} MB` : '—'}</td>
                        <td>{plan.priceCents != null ? `€${(plan.priceCents / 100).toFixed(2)}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {sims.length > 0 && (
          <div className="telebey-card" style={{ marginTop: '1.5rem' }}>
            <div className="telebey-card-header">
              <div>
                <h3 className="telebey-card-title">ApiGate SIMs</h3>
                <div className="telebey-card-description">SIMs owned by the service account</div>
              </div>
            </div>
            <div className="telebey-card-body">
              <table className="telebey-table">
                <thead>
                  <tr>
                    <th>ICCID</th>
                    <th>IMSI</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sims.map((sim) => (
                    <tr key={sim.id || sim.iccid}>
                      <td>{sim.iccid || '—'}</td>
                      <td>{sim.imsi || '—'}</td>
                      <td>{sim.status || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ApiGateContainer;
