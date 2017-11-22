import React, { Component } from 'react';
import cytoscape from 'cytoscape';
import _ from 'lodash';

import Cycle from './Cycle';

import CURRENCIES from 'config/currencies';
import config from 'config/cyto';
import { filters } from 'helpers';
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
      show: true,
      nodes,
      edges,
      edgesById,
      cycles,
      cyclesByEdge,
      filters: [ 'oneMaker', 'allHighVolume', 'allTopCurrencies', 'excludeCurrencies' ],
      filterParams: { excludeCurrencies: 'rrt,san,avt,qtm,dat,edo', includeCurrencies: '', onlyCurrencies: '' },
    };
    this.state.filteredCycles = this.filteredCycles(this.state.filters, this.state.filterParams, this.state.cycles);
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

  toggleFilter = filterKey => {
    let newFilters;
    if (this.state.filters.includes(filterKey)) {
      newFilters = _.pull(this.state.filters, filterKey);
    }
    else {
      newFilters = this.state.filters.concat(filterKey);
    }
    const filteredCycles = this.filteredCycles(newFilters, this.state.filterParams, this.state.cycles);
    this.setState({ filters: newFilters, filteredCycles });
  }

  filteredCycles = (currentFilters, currentFilterParams, cycles) => {
    const filteredCycles = _.filter(cycles, cycle => {
      const filterResults = currentFilters.map(filter => {
        const filterFunc = filters[filter].params?
        filters[filter].filter(currentFilterParams[filter]) :
        filters[filter].filter;
        return filterFunc(cycle);
      });
      const filteredIn = _.every(filterResults);
      return filteredIn;
    });
    return filteredCycles;
  }

  sortCycles = arg => {
    const sortedCycles = _.orderBy(this.state.filteredCycles, 'result', 'desc');
    this.setState({ sortedCycles });
  }

  updateCycles = cycles => {
    cycles.forEach(cycle => {
      const baseResult = cycle.path.reduce((accum, edge) => {
        return accum * parseFloat(edge.data('weight'));
      }, 1);
      const MAIN_CURRENCIES = ['eth', 'usd', 'eur', 'btc'];
      const altEdge = cycle.path.find(edge => {
        return !MAIN_CURRENCIES.includes(edge.data('source'));
      });
      const altCurrency = altEdge && altEdge.data('source');
      cycle.baseResult = baseResult;
      cycle.result = baseResult * cycle.fee;
      cycle.altCurrency = altCurrency || '';
    });
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    this.cy.destroy();
  }

  setShow = event => {
    this.setState({ show: event.target.checked });
  }

  setFilterParam = (filterKey, event) => {
    const newEntry = {};
    newEntry[filterKey] = event.target.value;
    const newFilterParams = Object.assign({}, this.state.filterParams, newEntry);
    const filteredCycles = this.filteredCycles(this.state.filters, newFilterParams, this.state.cycles);
    this.setState({ filteredCycles, filterParams: newFilterParams });
  }

  render() {
    const show = this.state.show;
    const toggleShow = <input type='checkbox'
      checked={show} onChange={this.setShow} />;
    if (!show) {
      return <div>{toggleShow} Show</div>;
    }
    const cycles = this.state.sortedCycles || [];
    const bestCycles = cycles.slice(0,100);
    const currentFilters = this.state.filters;
    const currentFilterParams = this.state.filterParams;
    return <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div>
        {toggleShow} Show
        {bestCycles.map((cycle, index) => <Cycle key={index} cycle={cycle} />)}
      </div>
      <div>
        {Object.keys(filters).map(filterKey => {
          const filterOn = currentFilters.includes(filterKey);
          const filterParam = currentFilterParams[filterKey];
          const hasParams = filters[filterKey].params;
          return <div key={filterKey}>
            <div>
              <input type='checkbox' checked={filterOn} onChange={_ => this.toggleFilter(filterKey)} />{filterKey}
            </div>
            {hasParams && <div>
              <input type='text' value={filterParam} onChange={event => this.setFilterParam(filterKey, event)}/>
            </div>}
          </div>;
        })}
      </div>
    </div>
  }
}

export default Cytoscape;
