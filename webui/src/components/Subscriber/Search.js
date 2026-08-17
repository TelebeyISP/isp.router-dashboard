import PropTypes from 'prop-types';

const Search = ({ value, onChange, onClear }) => (
  <div style={{
    position: 'relative',
    maxWidth: '28rem',
    width: '100%',
    marginBottom: '1.5rem'
  }}>
    <div style={{
      position: 'absolute',
      left: '0.875rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#94a3b8',
      display: 'flex',
      alignItems: 'center'
    }}>
      <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      className="telebey-input"
      style={{ paddingLeft: '2.75rem', paddingRight: value ? '2.5rem' : '0.875rem' }}
      placeholder="Search subscribers by IMSI or MSISDN..."
      value={value}
      onChange={onChange}
    />
    {value !== '' && (
      <button
        onClick={onClear}
        style={{
          position: 'absolute',
          right: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'none',
          border: 'none',
          color: '#94a3b8',
          cursor: 'pointer',
          padding: '0.25rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <svg style={{ width: '1rem', height: '1rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

Search.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onClear: PropTypes.func
};

export default Search;