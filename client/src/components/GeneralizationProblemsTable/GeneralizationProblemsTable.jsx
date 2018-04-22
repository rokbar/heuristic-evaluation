import React, {Component} from "react";
import {connect} from 'react-redux';
import { map } from 'lodash';
import PropTypes from 'prop-types';
import AgGrid from 'ag-grid';

import {AgGridReact} from "ag-grid-react";
import TableActionsRenderer from './TableActionsRenderer';
import PhotoCellRenderer from './PhotoCellRenderer';
import RulesCellRenderer from './RulesCellRenderer';
import ActionsCellRenderer from './ActionsCellRenderer';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import './GeneralizationProblemsTable.css';

const propTypes = {
  problems: PropTypes.array,
  mergeProblems: PropTypes.func.isRequired,
};

const defaultProps = {
  problems: [],
};

class GeneralizationProblemsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        // TODO - add order number column (currently UI doesn't sync order number with back-end after problem removal)
        {headerName: '', headerCheckboxSelectionFilteredOnly: true, checkboxSelection: true},
        {headerName: 'Aprašymas', field: 'description'},
        {headerName: 'Lokacija', field: 'location'},
        {headerName: 'Pažeistos euristikos', field: 'rules', cellRenderer: 'rulesCellRenderer'},
        {headerName: 'Nuotraukos', field: 'photos', cellRenderer: 'photoCellRenderer'},
        {headerName: 'Pasiūlymas taisymui', field: 'solution'},
        {headerName: 'Veiksmai', field: 'actions', cellRenderer: 'actionsCellRenderer'},
      ],
      getRowNodeId: function (data) {
        return data.id;
      },
      rowSelection: 'multiple',
      frameworkComponents: {
        photoCellRenderer: PhotoCellRenderer,
        rulesCellRenderer: RulesCellRenderer,
        actionsCellRenderer: (params) => <ActionsCellRenderer
          rules={props.heuristic && props.heuristic.rules && props.heuristic.rules}
          {...params}
          removeProblem={props.removeProblem}
          editProblem={props.editProblem}
        />,
      },
      isAnyRowSelected: false,
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  onSelectionChanged(event) {
    const selectedRowCount = event.api.getSelectedNodes().length;
    this.setState({isAnyRowSelected: selectedRowCount !== 0})
  }

  handleOnMergeProblemsClick = () => {
    const { mergeProblems } = this.props;
    const selectedRows = this.gridApi.getSelectedRows();

    mergeProblems(selectedRows);
  };

  render() {
    const {problems} = this.props;
    let containerStyle = {
      height: 500,
      width: '100%',
    };

    return (
      <div className="GeneralizationProblemsTable">
        <TableActionsRenderer
          mergeProblems={this.handleOnMergeProblemsClick.bind(this)}
        />
        <div style={containerStyle} className="ag-theme-balham">
          <AgGridReact
            rowData={problems}
            columnDefs={this.state.columnDefs}
            rowSelection={this.state.rowSelection}
            frameworkComponents={this.state.frameworkComponents}
            getRowNodeId={this.state.getRowNodeId}
            onGridReady={this.onGridReady.bind(this)}
            onSelectionChanged={this.onSelectionChanged.bind(this)}
          />
        </div>
      </div>
    )
  }
}

GeneralizationProblemsTable.propTypes = propTypes;
GeneralizationProblemsTable.defaultProps = defaultProps;

function mapStateToProps(state) {
  return {
    heuristic: state.heuristics.team[0],
  }
}

export default connect(
  mapStateToProps,
)(GeneralizationProblemsTable);
