import PropTypes from 'prop-types';
import Item from './Item';

const propTypes = {
  profiles: PropTypes.arrayOf(PropTypes.object),
  deletedId: PropTypes.string,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

const List = ({ profiles, deletedId, onView, onEdit, onDelete }) => {
  if (!profiles || profiles.length === 0) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {profiles.map(profile => (
        <Item
          key={profile._id}
          profile={profile}
          disabled={deletedId === profile._id}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

List.propTypes = propTypes;

export default List;
