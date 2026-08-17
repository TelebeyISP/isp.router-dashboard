import PropTypes from 'prop-types';
import Item from './Item';

const propTypes = {
  subscribers: PropTypes.arrayOf(PropTypes.object),
  deletedImsi: PropTypes.string,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  search: PropTypes.string
};

const List = ({ subscribers, deletedImsi, onView, onEdit, onDelete, search }) => {
  function pred(s) {
    if (!search || search === '') return true;
    const sSearch = search.toLowerCase();
    const matchImsi = s.imsi && s.imsi.toLowerCase().includes(sSearch);
    const matchMsisdn = s.msisdn && s.msisdn.some(m => m && m.toLowerCase().includes(sSearch));
    return matchImsi || matchMsisdn;
  }

  const filteredSubscribers = subscribers
    .filter(pred)
    .sort((a, b) => (a.imsi > b.imsi ? 1 : a.imsi < b.imsi ? -1 : 0));

  if (filteredSubscribers.length === 0) {
    return null;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '1.25rem',
      marginBottom: '2rem'
    }}>
      {filteredSubscribers.map(subscriber => (
        <Item
          key={subscriber.imsi}
          subscriber={subscriber}
          disabled={deletedImsi === subscriber.imsi}
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