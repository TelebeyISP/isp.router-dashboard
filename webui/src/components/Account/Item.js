import { Component } from 'react';
import PropTypes from 'prop-types';

class Item extends Component {
  static propTypes = {
    account: PropTypes.shape({
      username: PropTypes.string,
      roles: PropTypes.array
    }),
    session: PropTypes.object,
    disabled: PropTypes.bool,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func
  };

  handleEdit = (e) => {
    e.stopPropagation();
    const { account, onEdit } = this.props;
    onEdit(account.username);
  };

  handleDelete = (e) => {
    e.stopPropagation();
    const { account, onDelete } = this.props;
    onDelete(account.username);
  };

  render() {
    const { account, session, disabled } = this.props;
    const isSelf = session && session.user && session.user.username === account.username;
    const roleName = account.roles && account.roles.length > 0 ? account.roles[0] : 'user';

    return (
      <div 
        className="telebey-card"
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'default' : 'pointer'
        }}
        onClick={() => !disabled && this.handleEdit}
      >
        <div className="telebey-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '9999px',
              backgroundColor: isSelf ? 'rgba(30, 111, 217, 0.15)' : '#f1f5f9',
              color: isSelf ? '#1e6fd9' : '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '1rem'
            }}>
              {account.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="telebey-card-title">{account.username}</h3>
              <div className="telebey-card-description">{isSelf ? 'Current Active Session' : 'WebUI Admin Account'}</div>
            </div>
          </div>
          <span className={`telebey-badge ${roleName === 'admin' ? 'telebey-badge-info' : 'telebey-badge-warning'}`}>
            {roleName.toUpperCase()}
          </span>
        </div>

        <div className="telebey-card-footer">
          {!isSelf && (
            <button 
              className="telebey-btn telebey-btn-outline-danger telebey-btn-sm"
              onClick={this.handleDelete}
              disabled={disabled}
            >
              Delete User
            </button>
          )}
          <button 
            className="telebey-btn telebey-btn-secondary telebey-btn-sm"
            onClick={this.handleEdit}
            disabled={disabled}
          >
            Change Password
          </button>
        </div>
      </div>
    );
  }
}

export default Item;
