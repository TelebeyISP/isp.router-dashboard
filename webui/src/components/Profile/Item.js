import { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {
  static propTypes = {
    profile: PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      ambr: PropTypes.object,
      slice: PropTypes.array
    }),
    disabled: PropTypes.bool,
    onView: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  };

  handleEdit = (e) => {
    e.stopPropagation();
    const { profile, onEdit } = this.props;
    onEdit(profile._id);
  };

  handleDelete = (e) => {
    e.stopPropagation();
    const { profile, onDelete } = this.props;
    onDelete(profile._id);
  };

  formatRate = (rateObj) => {
    if (!rateObj || rateObj.value === undefined) return 'Unlimited';
    const units = ['bps', 'Kbps', 'Mbps', 'Gbps', 'Tbps'];
    const unitStr = rateObj.unit !== undefined && units[rateObj.unit] ? units[rateObj.unit] : 'bps';
    return `${rateObj.value} ${unitStr}`;
  };

  render() {
    const { profile, disabled, onView } = this.props;
    const { _id, title, ambr } = profile;

    const dlRate = ambr ? this.formatRate(ambr.downlink) : 'Unlimited';
    const ulRate = ambr ? this.formatRate(ambr.uplink) : 'Unlimited';

    return (
      <div 
        className="telebey-card" 
        style={{
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer'
        }}
        onClick={() => !disabled && onView(_id)}
      >
        <div className="telebey-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'rgba(30, 111, 217, 0.08)',
              color: '#1e6fd9',
              display: 'flex',
              alignItems: 'center',
              justify-content: 'center'
            }}>
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.14 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
              </svg>
            </div>
            <div>
              <h3 className="telebey-card-title">{title || 'Data Profile'}</h3>
              <div className="telebey-card-description">APN & Bitrate Policy</div>
            </div>
          </div>
          <span className="telebey-badge telebey-badge-info">Active Plan</span>
        </div>

        <div className="telebey-card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Downlink AMBR:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{dlRate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
            <span style={{ color: '#64748b' }}>Uplink AMBR:</span>
            <span style={{ fontWeight: 600, color: '#0f172a' }}>{ulRate}</span>
          </div>
        </div>

        <div className="telebey-card-footer">
          <button 
            className="telebey-btn telebey-btn-outline-danger telebey-btn-sm"
            onClick={this.handleDelete}
            disabled={disabled}
          >
            Delete
          </button>
          <button 
            className="telebey-btn telebey-btn-secondary telebey-btn-sm"
            onClick={this.handleEdit}
            disabled={disabled}
          >
            Edit Profile
          </button>
        </div>
      </div>
    );
  }
}

export default Item;
