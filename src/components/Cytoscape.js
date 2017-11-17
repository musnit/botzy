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
  }

  testUpdates = updates => {
    updates.forEach(update => {
      const edgeToUpdate = this.state.edgesById[update.edgeId];
      edgeToUpdate.data(update.data);
      const cyclesToUpdate = this.state.cyclesByEdge[update.edgeId];
      this.updateCycles(cyclesToUpdate);
    });
  }

  updateCycles = cycles => {
    cycles.forEach(c => {
      c.win = 2.5;
    });
    this.forceUpdate();
  }

  componentDidMount() {
  }

  shouldComponentUpdate() {
    return false;
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
    const cycles = this.state.cycles || [1];
    return <div>
      <div style={cyStyle} ref="cyElement" />
      <Cycle cycle={cycles[0]} />
      <div>{cycles[0].path[0].data('id') }{JSON.stringify(cycles[0].path[0].data())}</div>
    </div>
  }
}

class Cycle extends Component {

  render() {
    return <div>
      {JSON.stringify(this.props.cycle.path.map(edge => edge.data('id')))}
      x{this.props.cycle.win}x
    </div>
  }

}

export default Cytoscape;
