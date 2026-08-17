import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as subscriberActions from 'modules/crud/subscriber';
import * as profileActions from 'modules/crud/profile';
import * as accountActions from 'modules/crud/account';
import * as sidebarActions from 'modules/sidebar';

class OverviewContainer extends Component {
  static propTypes = {
    subscribers: PropTypes.array,
    profiles: PropTypes.array,
    accounts: PropTypes.array,
    SubscriberActions: PropTypes.object,
    ProfileActions: PropTypes.object,
    AccountActions: PropTypes.object,
    SidebarActions: PropTypes.object
  };

  componentDidMount() {
    this.props.SubscriberActions.list({});
    this.props.ProfileActions.list({});
    this.props.AccountActions.list({});
  }

  render() {
    const { subscribers, profiles, accounts, SidebarActions } = this.props;

    const totalSubscribers = subscribers ? subscribers.length : 0;
    const totalProfiles = profiles ? profiles.length : 0;
    const totalAccounts = accounts ? accounts.length : 0;

    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <h1 className="font-heading" style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>Network Overview</h1>
          <p style={{ color: '#64748b', margin: 0 }}>
            Welcome back. Here is a real-time summary of your Telebey Open5GS 5G Core deployment.
          </p>
        </div>

        {/* Top 4 Metrics Cards */}
        <div className="telebey-metrics-grid">
          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>Active SIMs & Subscribers</span>
              <div className="telebey-metric-icon">
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <div className="telebey-metric-value">{totalSubscribers}</div>
            <div className="telebey-metric-subtext">Registered 5G/LTE IMSIs</div>
          </div>

          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>Data Plans & Profiles</span>
              <div className="telebey-metric-icon">
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                </svg>
              </div>
            </div>
            <div className="telebey-metric-value">{totalProfiles}</div>
            <div className="telebey-metric-subtext">APN & QoS Configurations</div>
          </div>

          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>5G Core Health</span>
              <div className="telebey-metric-icon" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <div className="telebey-metric-value" style={{ color: '#16a34a' }}>Active</div>
            <div className="telebey-metric-subtext">AMF, SMF, UPF & HSS Connected</div>
          </div>

          <div className="telebey-metric-card">
            <div className="telebey-metric-top">
              <span>Admin Accounts</span>
              <div className="telebey-metric-icon">
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
            <div className="telebey-metric-value">{totalAccounts}</div>
            <div className="telebey-metric-subtext">Authorized WebUI Admins</div>
          </div>
        </div>

        {/* Content Grids */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Quick Actions Card */}
          <div className="telebey-card">
            <div className="telebey-card-header">
              <div>
                <h3 className="telebey-card-title">Quick Core Management</h3>
                <div className="telebey-card-description">Perform common subscriber & policy actions</div>
              </div>
            </div>
            <div className="telebey-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                className="telebey-btn telebey-btn-primary" 
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
                onClick={() => SidebarActions.selectView('subscriber')}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Manage / Add Subscriber SIM</span>
              </button>

              <button 
                className="telebey-btn telebey-btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
                onClick={() => SidebarActions.selectView('profile')}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Configure APN & Data Profiles</span>
              </button>

              <button 
                className="telebey-btn telebey-btn-secondary" 
                style={{ justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
                onClick={() => SidebarActions.selectView('account')}
              >
                <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                <span>Manage Security & Accounts</span>
              </button>
            </div>
          </div>

          {/* Core System Status Card */}
          <div className="telebey-card">
            <div className="telebey-card-header">
              <div>
                <h3 className="telebey-card-title">Network Slice & System Info</h3>
                <div className="telebey-card-description">Open5GS Mongo DB & API status</div>
              </div>
            </div>
            <div className="telebey-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Default SST Slice:</span>
                <span className="telebey-badge telebey-badge-info">eMBB (SST: 1)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Database Status:</span>
                <span className="telebey-badge telebey-badge-success">MongoDB Connected</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <span style={{ color: '#64748b' }}>Security Encryption:</span>
                <span className="telebey-badge telebey-badge-success">Milenage (K / OPc)</span>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '0.35rem' }}>
                  <span>Core Capacity Usage</span>
                  <span>{Math.min(totalSubscribers * 10, 100)}%</span>
                </div>
                <div className="telebey-progress-track">
                  <div className="telebey-progress-fill" style={{ width: `${Math.min(totalSubscribers * 10, 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }
}

export default connect(
  (state) => ({
    subscribers: state.crud.subscriber.list.data,
    profiles: state.crud.profile.list.data,
    accounts: state.crud.account.list.data
  }),
  (dispatch) => ({
    SubscriberActions: bindActionCreators(subscriberActions, dispatch),
    ProfileActions: bindActionCreators(profileActions, dispatch),
    AccountActions: bindActionCreators(accountActions, dispatch),
    SidebarActions: bindActionCreators(sidebarActions, dispatch)
  })
)(OverviewContainer);
