import PropTypes from 'prop-types';
import Head from 'next/head';
import Header from 'containers/Header';
import Sidebar from 'containers/Sidebar';
import Package from '../../../package';

const propTypes = {
  title: PropTypes.string
};

const defaultProps = {
  title: `Telebey Open5GS ${Package.version}`
};

const Layout = ({ title, children }) => (
  <div className="telebey-app-shell">
    <Head>
      <title>{title}</title>
    </Head>
    <Sidebar />
    <div className="telebey-main-content">
      <Header />
      <div className="telebey-page-body">
        {children}
      </div>
    </div>
  </div>
);

Layout.propTypes = propTypes;
Layout.defaultProps = defaultProps;

Layout.Container = ({ visible, children }) => visible ? (
  <div style={{ flex: 1 }}>
    {children}
  </div>
) : null;

Layout.Content = ({ children }) => (
  <div>{children}</div>
);

export default Layout;
