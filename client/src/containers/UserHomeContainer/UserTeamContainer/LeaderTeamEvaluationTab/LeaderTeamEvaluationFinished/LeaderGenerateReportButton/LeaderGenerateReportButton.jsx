import React, { Component } from 'react';
import { connect } from 'react-redux';
import { isArray, map, toNumber, reduce, find } from 'lodash';

import { Button, Icon } from 'semantic-ui-react';
import getReportMarkup from './ReportMarkup';

class LeaderGenerateReportButton extends Component {
  constructor(props) {
    super(props);
    this.state = { reportMarkup: null };
  }

  handleClick = () => {
    let problems, photos;
    this.getTableData()
      .then(problemsResponse => {
        problems = problemsResponse;
        return this.mapPhotosNumbers();
      })
      .then(photosResponse => {
        this.setState({
          reportMarkup: getReportMarkup({
            problems,
            photos: photosResponse,
          })
        })
      })
      .catch();
  };

  mapPhotosNumbers() {
    const { problems } = this.props;
    let lastProblemNumber = 0;

    return new Promise((resolve, reject) => {
      return Promise.all(
        reduce(problems, (result, item) => {
          const { photos } = item;
          return result.concat(map(photos, async (photo) => {
            const { width, height } = await this.renderImage(photo, 500);
            return {
              url: photo,
              width,
              height,
              number: ++lastProblemNumber,
            }
          }));
        }, [])
      )
        .then(mappedProblems => {
          resolve(mappedProblems);
        });
    });

  }

  getRulesDescriptionsList(problemRules) {
    const { rules } = this.props.heuristic;
    let mappedRules;

    if (isArray(problemRules)) {
      mappedRules = problemRules && map(problemRules, (id) => {
          const foundRule = find(rules, (x) => x.id === toNumber(id));
          return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
        });
    } else {
      mappedRules = problemRules && map(problemRules.split(','), (id) => {
          const foundRule = find(rules, (x) => x.id === toNumber(id));
          return foundRule ? `${foundRule.listNumber}. ${foundRule.description}` : null;
        });
    }

    return mappedRules && mappedRules.join(' ');
  }

  getTableData() {
    return new Promise((resolve, reject) => {
      return Promise.all(this.props.problems.map(async (item) => {
        const { description, location, photos, solution, rules } = item;
        const renderedPhoto = await this.renderPhotoCell(photos);
        return {
          description,
          rules: this.getRulesDescriptionsList(rules),
          location,
          photo: renderedPhoto,
          solution,
        };
      }))
        .then(problems => resolve(problems))
        .catch(reject);
    });
  }

  renderPhotoCell(photos) {
    return new Promise((resolve, reject) => {
      return Promise.all(map(photos, async (item) => this.renderImage(item, 80)
        .then(({ width, height }) => {
          return item
            ? <img height={height} width={width} src={item}/>
            : <label>-</label>;
        }),
      ))
        .then((photoCell) => resolve(<div>{photoCell}</div>))
        .catch(reject);
    });
  }

  renderImage(src, width = 80) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      let height = 0;
      img.onload = function() {
        height = this.height / (this.width / width);
        resolve({ width, height });
      };
      img.src = src;
    });
  }

  render() {
    const { disabled } = this.props;

    return [
      <Button
        disabled={disabled}
        color="teal"
        floated="right"
        size="small"
        onClick={this.handleClick}
        className="LeaderGenerateReportButton"
      >
        <Icon name="file word outline"/> Generuoti dokumentą
      </Button>,
      this.state.reportMarkup && <a
        download="report.doc"
        href={'data:text/html,' + encodeURIComponent(this.state.reportMarkup)}
      >Parsisiųsti</a>,
    ];
  }
}

function mapStateToProps(state) {
  return {
    heuristic: state.heuristics.team[0],
  }
}

export default connect(
  mapStateToProps,
)(LeaderGenerateReportButton);
