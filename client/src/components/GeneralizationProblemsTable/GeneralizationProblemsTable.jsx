import React, {Component} from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import AgGrid from 'ag-grid';

import {AgGridReact} from "ag-grid-react";
import PhotoCellRenderer from './PhotoCellRenderer';
import RulesCellRenderer from './RulesCellRenderer';
import ActionsCellRenderer from './ActionsCellRenderer';

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

const propTypes = {
  problems: PropTypes.array,
};

const defaultProps = {
  problems: [],
};

class GeneralizationProblemsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        {headerName: 'Aprašymas', field: 'description'},
        {headerName: 'Lokacija', field: 'location'},
        {headerName: 'Pažeistos euristikos', field: 'rules', cellRenderer: 'rulesCellRenderer'},
        {headerName: 'Nuotraukos', field: 'photos', cellRenderer: 'photoCellRenderer'},
        {headerName: 'Pasiūlymas taisymui', field: 'solution'},
        {headerName: 'Veiksmai', field: 'actions', cellRenderer: 'actionsCellRenderer'},
      ],
      getRowNodeId: function(data) {
        return data.id;
      },
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
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }

  render() {
    const { problems } = this.props;
    let containerStyle = {
      height: 500,
      width: '100%',
    };

    return (
      <div style={containerStyle} className="ag-theme-balham">
        <AgGridReact
          columnDefs={this.state.columnDefs}
          rowData={problems}
          frameworkComponents={this.state.frameworkComponents}
          getRowNodeId={this.state.getRowNodeId}
          onGridReady={this.onGridReady}
        />
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
