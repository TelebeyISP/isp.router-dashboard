import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { MODEL, fetchAccounts, deleteAccount } from 'modules/crud/account';
import { clearActionStatus } from 'modules/crud/actions';
import { select, selectActionStatus } from 'modules/crud/selectors';
import * as Notification from 'modules/notification/actions';

import { 
  Layout, 
  Account, 
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
      username: ''
    }
  };

  componentWillMount() {
    const { accounts, dispatch } = this.props;
    if (accounts.needsFetch) {
      dispatch(accounts.fetch);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { accounts, status } = nextProps;
    const { dispatch } = this.props;

    if (accounts.needsFetch) {
      dispatch(accounts.fetch);
    }

    if (status.response) {
      dispatch(Notification.success({
        title: 'Account',
        message: `${status.id} account has been deleted`
      }));
      dispatch(clearActionStatus(MODEL, 'delete'));
    } 

    if (status.error) {
      let title = 'Error';
      let message = 'Failed to delete account';
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
        }
      });
    },
    hide: () => {
      this.setState({
        document: {
          action: '',
          visible: false,
          dimmed: false
        }
      });
    },
    actions: {
      create: () => {
        this.documentHandler.show('create');
      },
      update: (username) => {
        this.documentHandler.show('update', { username });
      }
    }
  };

  confirmHandler = {
    show: (username) => {
      this.setState({
        confirm: {
          visible: true,
          username
        }
      });
    },
    hide: () => {
      this.setState({
        confirm: {
          ...this.state.confirm,
          visible: false
        }
      });
    },
    actions: {
      delete: () => {
        const { dispatch } = this.props;

        if (this.state.confirm.visible === true) {
          this.confirmHandler.hide();
          this.documentHandler.hide();

          dispatch(deleteAccount(this.state.confirm.username));
        }
      }
    }
  };

  render() {
    const { documentHandler, confirmHandler } = this;
    const { document } = this.state;
    const { session, accounts, status } = this.props;
    const { roles } = session.user;
    const { isLoading, data } = accounts;

    const isAdmin = roles.indexOf('admin') !== -1;

    return (
      <Layout.Content>
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h1 className="font-heading" style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>Accounts & Security</h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Manage Telebey Open5GS WebUI user accounts, admin credentials, and access roles.
            </p>
          </div>
          {isAdmin && (
            <button 
              className="telebey-btn telebey-btn-primary"
              onClick={documentHandler.actions.create}
            >
              <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Create Account</span>
            </button>
          )}
        </div>

        {/* Account List */}
        <Account.List
          session={session}
          accounts={data}
          deletedId={status.id}
          onEdit={documentHandler.actions.update}
          onDelete={confirmHandler.show}
        />

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <Spinner md />
          </div>
        )}

        {/* Form Modal */}
        <Document 
          {...document}
          session={session}
          onEdit={documentHandler.actions.update}
          onDelete={confirmHandler.show}
          onHide={documentHandler.hide} 
        />

        <Dimmed visible={document.dimmed} />

        {/* Confirm Delete */}
        <Confirm
          visible={this.state.confirm.visible}
          message="Are you sure you want to delete this user account?"
          onOutside={confirmHandler.hide}
          buttons={[
            { text: "CANCEL", action: confirmHandler.hide, info: true },
            { text: "DELETE ACCOUNT", action: confirmHandler.actions.delete, danger: true }
          ]}
        />
      </Layout.Content>
    );
  }
}

Collection.propTypes = {
  session: PropTypes.object,
  accounts: PropTypes.object,
  status: PropTypes.object,
  dispatch: PropTypes.func
};

Collection = connect(
  (state) => ({ 
    accounts: select(fetchAccounts(), state.crud),
    status: selectActionStatus(MODEL, state.crud, 'delete')
  })
)(Collection);

export default Collection;
