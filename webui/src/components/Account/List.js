import PropTypes from 'prop-types';
import Item from './Item';

const propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  deletedId: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  session: PropTypes.object
};

const List = ({ accounts, deletedId, onEdit, onDelete, session }) => {
  if (!accounts || accounts.length === 0) return null;

  const currentRole = session && session.user ? session.user.roles[0] : '';
  const currentUsername = session && session.user ? session.user.username : '';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {accounts.map(account => (
        <Item
          key={account.username}
          session={session}
          account={account}
          disabled={deletedId === account.username || (currentRole !== 'admin' && account.username !== currentUsername)}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

List.propTypes = propTypes;

export default List;
