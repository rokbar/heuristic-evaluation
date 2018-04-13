import React, {Component} from "react";
import AgGrid from 'ag-grid';
import {AgGridReact, AgGridColumn} from "ag-grid-react";

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';

export default class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rowData: [
        {make: "Toyota", model: "Celica", price: 35000},
        {make: "Ford", model: "Mondeo", price: 32000},
        {make: "Porsche", model: "Boxter", price: 72000}
      ]
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;

    this.gridApi.sizeColumnsToFit();
  }

  render() {
    let containerStyle = {
      height: 131
    };

    return (

      <div>
        <div style={containerStyle} className="ag-theme-balham">
          <AgGridReact
            // properties
            rowData={this.state.rowData}

            // events
            onGridReady={this.onGridReady}>

            {/*column definitions */}
            <AgGridColumn field="make"></AgGridColumn>
            <AgGridColumn field="model"></AgGridColumn>
            <AgGridColumn field="price"></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
    )
  }
};
