import React, { Component } from 'react';
import Layout from 'components/Layout';
import SharedMenuContainer from 'containers/SharedMenuContainer';

export default class SystemAdminHomeContainer extends Component {
  render() {
    return (
      <Layout
        header={SharedMenuContainer}
      />
    )
  }
}