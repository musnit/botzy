import React, {Component} from 'react';
import cytoscape from 'cytoscape';
import _ from 'lodash';

import CURRENCIES from 'config/currencies';
import config from 'config/cyto';
import { createEdgesForExchanges, findCyclesForGraph } from 'helpers';

const nodes = CURRENCIES.map(currency => ({ data: { id: currency } }));
const nodesByCurrency = _.keyBy(nodes, node => node.data.id);
nodesByCurrency.btc.renderedPosition = { x: 10000, y: 10000 };
nodesByCurrency.btc.position = { x: 10000, y: 10000 };

let cyStyle = {
  height: '800px',
  width: '800px',
  display: 'block'
};

class Cytoscape extends Component{
  cy = null;
  state = {};

  constructor(props) {
    super(props);
    this.baseConfig = Object.assign({},
      config,
      { elements: nodes },
      // { container: this.refs.cyElement }
    );

    const cy = cytoscape(this.baseConfig);
    this.cy = cy;

    const edgeData = createEdgesForExchanges(this.props.activeExchanges);
    cy.add(edgeData);
    const edges = cy.edges();
    const edgesById = _.keyBy(edges, e => e.data('id'));
    const time = Date.now();
    console.log('Finding cycles');
    const cycles = findCyclesForGraph(this.cy);
    const cyclesByEdge = cycles.reduce((accum, cycle) => {
      cycle.path.forEach(edge => {
        const edgeId = edge.data('id');
        accum[edgeId] = accum[edgeId] || [];
        accum[edgeId].push(cycle);
      });
      return accum;
    }, {});
    console.log(`Cycles ready! - Found in ${Date.now() - time}ms`);
    this.state = {
      nodes,
      edges,
      edgesById,
      cycles,
      cyclesByEdge,
    };
    window.testUpdates = this.testUpdates;
    setInterval(this.sortCycles, 1000);
  }

  testUpdates = updates => {
    updates.forEach(update => {
      const edgeToUpdate = this.state.edgesById[update.data.id];
      edgeToUpdate.data(update.data);
      const cyclesToUpdate = this.state.cyclesByEdge[update.data.id];
      this.updateCycles(cyclesToUpdate);
    });
  }

  sortCycles = arg => {
    console.log('starting');
    const filteredCycles = _.filter(this.state.cycles, cycle => {
      const someLowVolume = _.some(cycle.path, edge => {
        return edge.data('volume') < 1000;
      });
      return !someLowVolume;
    });
    const sortedCycles = _.orderBy(filteredCycles, 'result', 'desc');
    this.setState({ sortedCycles });
    console.log('done');
  }

  updateCycles = cycles => {
    cycles.forEach(cycle => {
      const result = cycle.path.reduce((accum, edge) => {
        return accum * parseFloat(edge.data('weight'));
      }, 1);
      cycle.result = result;
    });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    this.cy.destroy();
  }

  getCy() {
    return this.cy;
  }

  render() {
    const cycles = this.state.sortedCycles || [];
    const bestCycles = cycles.slice(0,100);
    return <div>
      {/* <div style={cyStyle} ref="cyElement" /> */}
      <div>
        {/* {cycles.map((cycle, index) => <Cycle key={index} cycle={cycle} />)} */}
        {bestCycles.map((cycle, index) => <Cycle key={index} cycle={cycle} />)}
      </div>
    </div>
  }
}

class Cycle extends Component {

  render() {
    const { cycle } = this.props;
    return <div>
      {cycle.result}&nbsp;&nbsp; {cycle.path.map((edge, index) => <span key={index}>
        {edge.data('id')} {edge.data('weight')}&nbsp;&nbsp;&nbsp;
      </span>)}
    </div>
  }

}

export default Cytoscape;
