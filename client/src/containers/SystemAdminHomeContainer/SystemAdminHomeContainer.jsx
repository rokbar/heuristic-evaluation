import React, {Component} from 'react';
import { Switch, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import Layout from 'components/Layout';
import Tabs from 'components/Tabs';
import SharedMenuContainer from 'containers/SharedMenuContainer';
import UsersTableContainer from './UsersTableContainer';
import AddUserForm from './UsersTableContainer/AddUserForm';

export default class SystemAdminHomeContainer extends Component {
  pushHistory(pathName) {
    this.props.history.push(pathName);
  };

  getTabs() {
    return [
      {name: 'Vartotojai', pathName: '/systemadmin/users'},
      {name: 'Įmonės', pathName: '/systemadmin/companies'},
    ]
  }

  renderAsideContent() {
    return (
      <div>Not Implemented</div>
    )
  }

  renderArticleSegment(Component) {
    return (
      <Segment attached="bottom">
        <Component
          pushHistory={(pathName) => this.pushHistory(pathName)}
        />
      </Segment>
    )
  }

  renderArticleContent() {
    const { location, addUser } = this.props;
    return [
      <Tabs
        panes={this.getTabs()}
        currentLocation={location.pathname}
      />,
      <Switch>
        <Route
          exact
          path='/systemadmin/users'
          component={() => this.renderArticleSegment(UsersTableContainer)}
        />
        <Route
          path='/systemadmin/users/add'
          component={() => this.renderArticleSegment(AddUserForm)}
        />
        <Route
          path='/systemadmin/companies'
          component={() => <div>Not Implemented</div>}
        />
      </Switch>,
    ]
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
