import React, {Component} from 'react';

import Layout from 'components/Layout';
import Tabs from 'components/Tabs';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import UsersTableContainer from './UsersTableContainer';

export default class SystemAdminHomeContainer extends Component {
  getTabs() {
    return [
      {menuItem: 'Vartotojai', component: UsersTableContainer},
      {menuItem: 'Įmonės', component: 'not implemented'},
    ]
  }

  renderAsideContent() {
    return (
      <div>Not Implemented</div>
    )
  }

  renderArticleContent() {
    return (
      <Tabs
        panes={this.getTabs()}
      />
    )
  }

  render() {
    return (
      <Layout
        header={SharedMenuContainer}
        article={this.renderArticleContent()}
        aside={this.renderAsideContent()}
      />
    )
  }
}