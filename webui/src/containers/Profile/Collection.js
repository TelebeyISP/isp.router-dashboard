import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MODEL, fetchProfiles, deleteProfile } from 'modules/crud/profile';
import { clearActionStatus } from 'modules/crud/actions';
import { select, selectActionStatus } from 'modules/crud/selectors';
import * as Notification from 'modules/notification/actions';

import { 
  Layout, 
  Profile, 
  Spinner, 
  Dimmed,
  Confirm
} from 'components';

import Document from './Document';

class Collection extends Component {
  state = {
    document: {
      action: '',
      visible: false,
      dimmed: false
    },
    confirm: {
      visible: false,
      _id: ''
    },
    view: {
      visible: false,
      disableOnClickOutside: false,
      _id: ''
    }
  };

  componentWillMount() {
    const { profiles, dispatch } = this.props;
    if (profiles.needsFetch) {
      dispatch(profiles.fetch);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { profiles, status } = nextProps;
    const { dispatch } = this.props;

    if (profiles.needsFetch) {
      dispatch(profiles.fetch);
    }

    if (status.response) {
      dispatch(Notification.success({
        title: 'Profile',
        message: `Profile deleted successfully`
      }));
      dispatch(clearActionStatus(MODEL, 'delete'));
    } 

    if (status.error) {
      let title = 'Error';
      let message = 'Failed to delete profile';
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
      update: (_id) => {
        this.documentHandler.show('update', { _id });
      }
    }
  };

  confirmHandler = {
    show: (_id) => {
      this.setState({
        confirm: {
          visible: true,
          _id
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

          dispatch(deleteProfile(this.state.confirm._id));
        }
      }
    }
  };

  viewHandler = {
    show: (_id) => {
      this.setState({
        view: {
          _id,
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
    const { documentHandler, viewHandler, confirmHandler } = this;
    const { document } = this.state;
    const { profiles, status } = this.props;
    const { isLoading, data } = profiles;

    return (
      <Layout.Content>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>Data Plans & Profiles</h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Configure APN templates, bitrate rules, and QoS levels for Telebey Open5GS subscribers.
            </p>
          </div>
          <button 
            className="telebey-btn telebey-btn-primary"
            onClick={documentHandler.actions.create}
          >
            <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Data Profile</span>
          </button>
        </div>

        {/* Profile List */}
        <Profile.List
          profiles={data}
          deletedId={status.id}
          onView={viewHandler.show}
          onEdit={documentHandler.actions.update}
          onDelete={confirmHandler.show}
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
            <h3 className="font-heading" style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>Add Your First Profile</h3>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>
              No data profiles found. Click here to configure a new APN & QoS profile.
            </p>
          </div>
        )}

        {/* View Modal */}
        <Profile.View
          visible={this.state.view.visible}
          profile={data.filter(profile => profile._id === this.state.view._id)[0]}
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

        {/* Confirm Delete */}
        <Confirm
          visible={this.state.confirm.visible}
          message="Are you sure you want to delete this data profile?"
          onOutside={confirmHandler.hide}
          buttons={[
            { text: "CANCEL", action: confirmHandler.hide, info: true },
            { text: "DELETE PROFILE", action: confirmHandler.actions.delete, danger: true }
          ]}
        />
      </Layout.Content>
    );
  }
}

Collection.propTypes = {
  profiles: PropTypes.object,
  status: PropTypes.object,
  dispatch: PropTypes.func
};

Collection = connect(
  (state) => ({ 
    profiles: select(fetchProfiles(), state.crud),
    status: selectActionStatus(MODEL, state.crud, 'delete')
  })
)(Collection);

export default Collection;
