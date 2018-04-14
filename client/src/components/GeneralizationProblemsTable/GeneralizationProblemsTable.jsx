import React, {Component} from "react";
import PropTypes from 'prop-types';
import AgGrid from 'ag-grid';

import {AgGridReact} from "ag-grid-react";
import PhotoCellRenderer from './PhotoCellRenderer';
import RulesCellRenderer from './RulesCellRenderer';

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
        {headerName: 'Aprašymas', field: 'description', editable: true},
        {headerName: 'Lokacija', field: 'location', editable: true},
        {headerName: 'Pažeistos euristikos', field: 'rules', editable: false, cellRenderer: 'rulesCellRenderer'},
        {headerName: 'Nuotraukos', field: 'photos', editable: false, cellRenderer: 'photoCellRenderer'},
        {headerName: 'Pasiūlymas taisymui', field: 'solution', editable: true},
      ],
      getRowNodeId: function(data) {
        return data.id;
      },
      frameworkComponents: {
        photoCellRenderer: PhotoCellRenderer,
        rulesCellRenderer: RulesCellRenderer,
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
      height: 500
    };

    return (
      <div>
        <div style={containerStyle} className="ag-theme-balham">
          <AgGridReact
            columnDefs={this.state.columnDefs}
            rowData={problems}
            frameworkComponents={this.state.frameworkComponents}
            getRowNodeId={this.state.getRowNodeId}
            onGridReady={this.onGridReady}
          />
        </div>
      </div>
    )
  }
}

GeneralizationProblemsTable.propTypes = propTypes;
GeneralizationProblemsTable.defaultProps = defaultProps;

export default GeneralizationProblemsTable;
