import PropTypes from 'prop-types';
import Modal from './Modal';
import Dimmed from './Dimmed';

const Confirm = ({ visible, onOutside, message, buttons }) => {
  if (!visible) return null;

  return (
    <div>
      <Modal
        visible={visible}
        onOutside={onOutside}
        zindex="1000"
        transitionEnterTimeout={10}
        transitionLeaveTimeout={30}
      >
        <div className="telebey-card" style={{ width: '22rem', padding: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '9999px',
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justify-content: 'center',
              flexShrink: 0
            }}>
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading" style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a' }}>Confirm Action</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Please review your choice</p>
            </div>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#334155', marginBottom: '1.5rem' }}>
            {message}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
            {buttons.map(button => (
              <button
                key={button.text}
                className={`telebey-btn ${button.danger ? 'telebey-btn-danger' : 'telebey-btn-secondary'} telebey-btn-sm`}
                onClick={button.action}
              >
                {button.text}
              </button>
            ))}
          </div>
        </div>
      </Modal>
      <Dimmed visible={visible} zindex="999" />
    </div>
  );
};

Confirm.propTypes = {
  visible: PropTypes.bool,
  onOutside: PropTypes.func,
  message: PropTypes.string,
  buttons: PropTypes.array
};

Confirm.defaultProps = {
  visible: false,
  onOutside: () => {},
  buttons: []
};

export default Confirm;