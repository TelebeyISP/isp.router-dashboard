import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MODEL, fetchSubscribers, deleteSubscriber } from 'modules/crud/subscriber';
import { clearActionStatus } from 'modules/crud/actions';
import { select, selectActionStatus } from 'modules/crud/selectors';
import * as Notification from 'modules/notification/actions';

import { 
  Layout, 
  Subscriber, 
  Spinner, 
  Dimmed,
  Confirm
} from 'components';

import Document from './Document';

class Collection extends Component {
  state = {
    search: '',
    document: {
      action: '',
      visible: false,
      dimmed: false
    },
    confirm: {
      visible: false,
      imsi: ''
    },
    view: {
      visible: false,
      disableOnClickOutside: false,
      imsi: ''
    }
  };

  componentWillMount() {
    const { subscribers, dispatch } = this.props;
    if (subscribers.needsFetch) {
      dispatch(subscribers.fetch);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { subscribers, status } = nextProps;
    const { dispatch } = this.props;

    if (subscribers.needsFetch) {
      dispatch(subscribers.fetch);
    }

    if (status.response) {
      dispatch(Notification.success({
        title: 'Subscriber',
        message: `${status.id} has been deleted`
      }));
      dispatch(clearActionStatus(MODEL, 'delete'));
    } 

    if (status.error) {
      let title = 'Error';
      let message = 'Failed to delete subscriber';
      if (status.error.data && status.error.data.message) {
        title = status.error.data.name || 'Error';
        message = status.error.data.message;
      }

      dispatch(Notification.error({
        title,
        message,
        autoDismiss: 0,
        action: { label: 'Dismiss' }
      }));
      dispatch(clearActionStatus(MODEL, 'delete'));
    }
  }

  handleSearchChange = (e) => {
    this.setState({ search: e.target.value });
  };

  handleSearchClear = () => {
    this.setState({ search: '' });
  };

  documentHandler = {
    show: (action, payload) => {
      this.setState({
        document: {
          action,
          visible: true,
          dimmed: true,
          ...payload
        },
        view: {
          ...this.state.view,
          disableOnClickOutside: true
        }
      });
    },
    hide: () => {
      this.setState({
        document: {
          action: '',
          visible: false,
          dimmed: false
        },
        view: {
          ...this.state.view,
          disableOnClickOutside: false
        }
      });
    },
    actions: {
      create: () => {
        this.documentHandler.show('create');
      },
      update: (imsi) => {
        this.documentHandler.show('update', { imsi });
      }
    }
  };

  confirmHandler = {
    show: (imsi) => {
      this.setState({
        confirm: {
          visible: true,
          imsi
        },
        view: {
          ...this.state.view,
          disableOnClickOutside: true
        }
      });
    },
    hide: () => {
      this.setState({
        confirm: {
          ...this.state.confirm,
          visible: false
        },
        view: {
          ...this.state.view,
          disableOnClickOutside: false
        }
      });
    },
    actions: {
      delete: () => {
        const { dispatch } = this.props;

        if (this.state.confirm.visible === true) {
          this.confirmHandler.hide();
          this.documentHandler.hide();
          this.viewHandler.hide();

          dispatch(deleteSubscriber(this.state.confirm.imsi));
        }
      }
    }
  };

  viewHandler = {
    show: (imsi) => {
      this.setState({
        view: {
          imsi,
          visible: true,
          disableOnClickOutside: false
        }
      });
    },
    hide: () => {
      this.setState({
        view: {
          ...this.state.view,
          visible: false
        }
      });
    }
  };

  render() {
    const {
      handleSearchChange,
      handleSearchClear,
      documentHandler,
      viewHandler,
      confirmHandler
    } = this;

    const { search, document } = this.state;
    const { subscribers, status } = this.props;
    const { isLoading, data } = subscribers;

    return (
      <Layout.Content>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>SIM & Subscriber Management</h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Manage your Telebey Open5GS subscribers, IMSIs, security keys (K/OPc), and data profiles.
            </p>
          </div>
          <button 
            className="telebey-btn telebey-btn-primary"
            onClick={documentHandler.actions.create}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Activate New SIM</span>
          </button>
        </div>

        {/* Search */}
        <Subscriber.Search 
          onChange={handleSearchChange}
          value={search}
          onClear={handleSearchClear} 
        />

        {/* Subscriber Grid */}
        <Subscriber.List
          subscribers={data}
          deletedImsi={status.id}
          onView={viewHandler.show}
          onEdit={documentHandler.actions.update}
          onDelete={confirmHandler.show}
          search={search}
        />

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner md />
          </div>
        )}

        {/* Empty State */}
        {!isLoading && data.length === 0 && (
          <div 
            className="telebey-card" 
            style={{ 
              borderStyle: 'dashed', 
              borderWidth: '2px', 
              padding: '3rem', 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            onClick={documentHandler.actions.create}
          >
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(30, 111, 217, 0.1)',
              color: '#1e6fd9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <svg style={{ width: '1.75rem', height: '1.75rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="font-heading" style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>Add Your First Subscriber</h3>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
              No SIM cards or subscribers found. Click here to configure a new IMSI in Open5GS.
            </p>
          </div>
        )}

        {/* View Modal / Drawer */}
        <Subscriber.View
          visible={this.state.view.visible}
          subscriber={data.filter(subscriber => subscriber.imsi === this.state.view.imsi)[0]}
          disableOnClickOutside={this.state.view.disableOnClickOutside}
          onEdit={documentHandler.actions.update}
          onDelete={confirmHandler.show}
          onHide={viewHandler.hide}
        />

        {/* Edit / Create Form Modal */}
        <Document 
          {...document}
          onEdit={documentHandler.actions.update}
          onDelete={confirmHandler.show}
          onHide={documentHandler.hide} 
        />

        <Dimmed visible={document.dimmed} />

        {/* Delete Confirmation */}
        <Confirm
          visible={this.state.confirm.visible}
          message="Are you sure you want to delete this subscriber from Open5GS?"
          onOutside={confirmHandler.hide}
          buttons={[
            { text: "CANCEL", action: confirmHandler.hide, info: true },
            { text: "DELETE SUBSCRIBER", action: confirmHandler.actions.delete, danger: true }
          ]}
        />
      </Layout.Content>
    );
  }
}

Collection.propTypes = {
  subscribers: PropTypes.object,
  status: PropTypes.object,
  dispatch: PropTypes.func
};

Collection = connect(
  (state) => ({ 
    subscribers: select(fetchSubscribers(), state.crud),
    status: selectActionStatus(MODEL, state.crud, 'delete')
  })
)(Collection);

export default Collection;