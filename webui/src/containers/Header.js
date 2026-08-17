import { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as sidebarActions from 'modules/sidebar';

import axios from 'axios';
import Session from 'modules/auth/session';
import { Header, Logout, Dimmed } from 'components';

class HeaderContainer extends Component {
  state = {
    logout: {
      visible: false,
      dimmed: false
    },
    apigateConnected: false
  };

  componentDidMount() {
    const sessionData = new Session();
    const csrf = ((sessionData || {}).session || {}).csrfToken;
    const authToken = ((sessionData || {}).session || {}).authToken;
    const headers = { 'X-CSRF-TOKEN': csrf };
    if (authToken) {
      headers.Authorization = 'Bearer ' + authToken;
    }
    axios.get('/api/apigate/status', { headers: headers })
      .then((response) => {
        this.setState({ apigateConnected: !!(response.data && response.data.connected) });
      })
      .catch(() => {
        this.setState({ apigateConnected: false });
      });
  }

  logoutHandler = {
    show: () => {
      this.setState({
        logout: {
          visible: true,
          dimmed: true
        }
      })
    },
    hide: () => {
      this.setState({
        logout: {
          visible: false,
          dimmed: false
        }
      })
    },
    logout: async () => {
      this.setState({
        logout: {
          visible: false,
        }
      })

      const session = new Session()
      await session.signout()

      // @FIXME next/router not working reliably so using window.location
      window.location = '/'
    }
  };

  handleSidebarToggle = () => {
    const { SidebarActions } = this.props;
    SidebarActions.toggle();
  }

  render() {
    const {
      handleSidebarToggle,
      logoutHandler
    } = this;

    const {
      logout
    } = this.state;

    return (
      <div>
        <Header 
          onSidebarToggle={handleSidebarToggle}
          onLogoutRequest={logoutHandler.show}
          apigateConnected={this.state.apigateConnected}
        />
        <Logout 
          visible={logout.visible}
          onHide={logoutHandler.hide}
          onLogout={logoutHandler.logout} />
        <Dimmed visible={logout.dimmed} />
      </div>
    )
  }
}

HeaderContainer = connect(
  null,
  (dispatch) => ({
    SidebarActions: bindActionCreators(sidebarActions, dispatch)
  })
)(HeaderContainer);

export default HeaderContainer;