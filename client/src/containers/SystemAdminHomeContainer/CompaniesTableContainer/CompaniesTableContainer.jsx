import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import DataTable from 'components/DataTable';
import AddCompanyButton from './AddCompanyButton';
import { getCompanies } from 'actions/companies';

const propTypes = {
  companies: PropTypes.array,
};

const defaultProps = {
  companies: [],
};

class CompaniesTableContainer extends Component {
  componentDidMount() {
    this.props.getCompanies();
  }

  getTableHeaders() {
    return {
      name: 'Vardas',
      country: 'Šalis',
      url: 'Svetainė',
      address: 'Adresas',
      actions: 'Veiksmai',
    }
  }

  getTableData() {
    return this.props.companies.map(item => {
      const { name, country, url, address } = item;
      return { name, country, url, address };
    })
  }

  renderTableActions() {
    return <AddCompanyButton
      pushHistory={this.props.pushHistory}
    />
  }

  render() {
    return(
      <DataTable
        actions={this.renderTableActions()}
        headers={this.getTableHeaders()}
        data={this.getTableData()}
      />
    )
  }
}

CompaniesTableContainer.propTypes = propTypes;
CompaniesTableContainer.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    companies: state.companies,
  }
}

export default connect(mapStateToProps, {
  getCompanies,
})(CompaniesTableContainer);