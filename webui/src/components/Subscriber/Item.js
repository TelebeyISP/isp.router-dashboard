import { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {
  static propTypes = {
    subscriber: PropTypes.shape({
      imsi: PropTypes.string,
      msisdn: PropTypes.array
    }),
    disabled: PropTypes.bool,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  };

  handleEdit = (e) => {
    e.stopPropagation();
    const { subscriber, onEdit } = this.props;
    onEdit(subscriber.imsi);
  };

  handleDelete = (e) => {
    e.stopPropagation();
    const { subscriber, onDelete } = this.props;
    onDelete(subscriber.imsi);
  };

  render() {
    const { subscriber, disabled, onView } = this.props;
    const { imsi, msisdn } = subscriber;
    const msisdnStr = msisdn && msisdn.length > 0 ? msisdn.join(', ') : 'No MSISDN';

    return (
      <div 
        className="telebey-card" 
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative'
        }}
        onClick={() => !disabled && onView(imsi)}
      >
        <div className="telebey-card-header" style={{ borderBottom: 'none', paddingBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(30, 111, 217, 0.1)',
              color: '#1e6fd9',
              display: 'flex',
              alignItems: 'center',
              justify-content: 'center'
            }}>
              <svg style={{ width: '1.35rem', height: '1.35rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>5G / LTE SIM</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>
                {imsi}
              </div>
            </div>
          </div>
          <span className="telebey-badge telebey-badge-success">
            <span className="telebey-status-dot" style={{ width: '0.4rem', height: '0.4rem' }}></span>
            Active
          </span>
        </div>

        <div className="telebey-card-body" style={{ paddingTop: '0.25rem', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <div>
              <span style={{ color: '#94a3b8' }}>MSISDN: </span>
              <span style={{ color: '#334155', fontWeight: 500 }}>{msisdnStr}</span>
            </div>
          </div>
        </div>

        <div className="telebey-card-footer">
          <button 
            className="telebey-btn telebey-btn-outline-danger telebey-btn-sm"
            onClick={this.handleDelete}
            disabled={disabled}
          >
            <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
          <button 
            className="telebey-btn telebey-btn-secondary telebey-btn-sm"
            onClick={this.handleEdit}
            disabled={disabled}
          >
            <svg style={{ width: '0.875rem', height: '0.875rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>Edit</span>
          </button>
        </div>
      </div>
    );
  }
}

export default Item;
