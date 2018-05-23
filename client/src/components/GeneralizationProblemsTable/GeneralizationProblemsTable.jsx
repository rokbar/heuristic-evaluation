import React, {Component} from "react";
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import AgGrid from 'ag-grid';

import {AgGridReact} from "ag-grid-react";
import TableActionsRenderer from './TableActionsRenderer';
import PhotoCellRenderer from './PhotoCellRenderer';
import RulesCellRenderer from './RulesCellRenderer';
import ActionsCellRenderer from './ActionsCellRenderer';

import {teamState} from 'utils/enums'

import 'ag-grid/dist/styles/ag-grid.css';
import 'ag-grid/dist/styles/ag-theme-balham.css';
import './GeneralizationProblemsTable.css';

const propTypes = {
  teamState: teamState.generalization,
  problems: PropTypes.array,
  editProblem: PropTypes.func,
  removeProblem: PropTypes.func,
  mergeProblems: PropTypes.func,
  dragProblem: PropTypes.func,
  usersRatingsColDefs: PropTypes.array,
};

const defaultProps = {
  problems: [],
  editProblem: null,
  removeProblem: null,
  mergeProblems: null,
  dragProblem: null,
  usersRatingsColDefs: [],
};

class GeneralizationProblemsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columnDefs: [
        // TODO - add order number column (currently UI doesn't sync order number with back-end after problem removal)
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          checkboxSelection: props.mergeProblems && true,
          rowDrag: props.dragProblem && true,
          width: 80,
          suppressSizeToFit: true,
          suppressFilter: true,
          cellClass: "cell-wrap-text",
          autoHeight: true,
        },
        {
          headerName: 'Aprašymas',
          field: 'description',
          cellClass: "cell-wrap-text",
          autoHeight: true,
        },
        {
          headerName: 'Lokacija',
          field: 'location',
          cellClass: "cell-wrap-text",
          autoHeight: true,
        },
        {
          headerName: 'Pažeistos euristikos',
          field: 'rules',
          cellRenderer: 'rulesCellRenderer',
          cellClass: "cell-wrap-text",
          autoHeight: true,
        },
        {
          headerName: 'Nuotraukos',
          field: 'photos',
          cellRenderer: 'photoCellRenderer',
          suppressFilter: true,
          cellClass: 'cell-wrap-text',
          autoHeight: true,
        },
        {
          headerName: 'Aptiko, Įvertinimas',
          groupId: 'usersRatings',
          suppressFilter: true,
          children: [...props.usersRatingsColDefs],
          autoHeight: true,
        },
        {
          headerName: 'Vid.',
          field: 'ratingsAverage',
          autoHeight: true,
          width: 60,
          hide: props.teamState !== teamState.evaluationFinished,
        },
        {
          headerName: 'Pasiūlymas taisymui',
          field: 'solution',
          cellClass: "cell-wrap-text",
          autoHeight: true,
        },
        {
          headerName: 'Veiksmai',
          field: 'actions',
          cellRenderer: 'actionsCellRenderer',
          suppressFilter: true,
          cellClass: "cell-wrap-text",
          autoHeight: true,
        },
      ],
      localeText: {
        page: "Puslapis",
        more: "Daugiau",
        to: "Iki",
        next: "Kitas",
        last: "Paskutinis",
        first: "Pirmas",
        previous: "Ankstesnis",
        loadingOoo: "Kraunasi...",
        selectAll: "Pasirinkti viską",
        searchOoo: "Ieškoti...",
        blanks: "Tuščias",
        filterOoo: "Filtruoti...",
        applyFilter: "Pritaikyti filtrą...",
        equals: "Lygu",
        notEqual: "Nelygu",
        lessThanOrEqual: "Mažiau arba lygu",
        greaterThanOrEqual: "Daugiau arba lygu",
        inRange: "Rėžyje",
        lessThan: "Mažiau nei",
        greaterThan: "Daugiau nei",
        contains: "Susideda iš",
        notContains: "Nesusideda iš",
        startsWith: "Prasideda su",
        endsWith: "Baigiasi su",
        group: "Grupė",
        columns: "Stulpelis",
        groups: "Grupės",
        values: "Reikšmės",
        noRowsToShow: "Nėra duomenų",
        autosizeThiscolumn: "Pataisyti stulpelio dydį",
        autosizeAllColumns: "Pataisyti stulpelių dydį",
        resetColumns: "Atstatyti stulpelius",
        expandAll: "Išskleisti visus",
        collapseAll: "Sutraukti visus",
        sum: "Suma",
        min: "Min",
        max: "Max",
        first: "Pirmas",
        last: "Paskutinis",
        none: "Nėra",
        count: "Kiekis",
        average: "Vidurkis",
        copy: "Kopijuoti",
        ctrlC: "Ctrl + C",
        paste: "Įklijuoti",
        ctrlV: "Ctrl + V",
      },
      defaultColDef: {
        width: 150,
        editable: true,
        filter: "agTextColumnFilter"
      },
      defaultColGroupDef: {marryChildren: true},
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
      getRowHeight: function (params) {
        return 100;
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();

    setTimeout(function () {
      params.api.resetRowHeights();
    }, 500);
  }

  onSelectionChanged(event) {
    const selectedRowCount = event.api.getSelectedNodes().length;
    this.setState({isAnyRowSelected: selectedRowCount !== 0})
  }

  onRowDragEnd(event) {
    const {node: {data: {id, position},}, overIndex} = event;
    const {dragProblem} = this.props;
    // position count starts from 1, overIndex starts from 0
    if (position === overIndex + 1) {
      // if position was not changed we do not bother to make a request to api
      return 0;
    } else {
      const wasDraggedUp = position > overIndex + 1;
      dragProblem(id, overIndex + 1, wasDraggedUp);
    }
  }

  handleOnMergeProblemsClick = () => {
    const {mergeProblems} = this.props;
    const selectedRows = this.gridApi.getSelectedRows();

    mergeProblems(selectedRows);
  };

  render() {
    const {problems, mergeProblems} = this.props;
    let containerStyle = {
      boxSizing: "border-box",
      height: 500,
      width: "100%"
    };
    return (
      <div className="GeneralizationProblemsTable" style={{width: "100%", height: "100%"}}>
        {mergeProblems && <TableActionsRenderer
          mergeProblems={this.handleOnMergeProblemsClick.bind(this)}
        />}
        <div style={containerStyle} className="ag-theme-balham">
          <AgGridReact
            rowData={problems}
            columnDefs={this.state.columnDefs}
            defaultColDef={this.state.defaultColDef}
            defaultColGroupDef={this.state.defaultColGroupDef}
            rowSelection={this.state.rowSelection}
            rowDragManaged={true}
            animateRows={true}
            enableFilter={true}
            enableColResize={true}
            enableSorting={true}
            frameworkComponents={this.state.frameworkComponents}
            localeText={this.state.localeText}
            getRowNodeId={this.state.getRowNodeId}
            onGridReady={this.onGridReady.bind(this)}
            onSelectionChanged={this.onSelectionChanged.bind(this)}
            onRowDragEnd={this.onRowDragEnd.bind(this)}
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
