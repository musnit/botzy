import React, {Component} from 'react';
import cytoscape from 'cytoscape';
import _ from 'lodash';

import CURRENCIES from '../config/currencies';
import config from '../config/cyto';

const nodes = CURRENCIES.map(currency => ({ data: { id: currency } }));
const nodesByCurrency = _.keyBy(nodes, node => node.data.id);
nodesByCurrency.btc.renderedPosition = { x: 10000, y: 10000 };
nodesByCurrency.btc.position = { x: 10000, y: 10000 };

let cyStyle = {
  height: '400px',
  width: '600px',
  display: 'block'
};

class Cytoscape extends Component{
  cy = null;

  componentDidMount() {
    this.baseConfig = Object.assign({},
      config,
      { elements: nodes },
      { container: this.refs.cyElement }
    );
    this.cy = cytoscape(this.baseConfig);
    window.addEdges = this.addEdges;
  }

  addEdges = newEdges => {
    this.cy.add(newEdges);
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillReceiveProps(nextProps) {
    this.cy.json(nextProps);
  }

  componentWillUnmount() {
    this.cy.destroy();
  }

  getCy() {
    return this.cy;
  }

  render() {
    return <div style={cyStyle} ref="cyElement" />
  }
}

export default Cytoscape;
