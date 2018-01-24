import React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import { Helmet } from 'react-helmet';

import EXCHANGES from 'config/exchanges';

import Cytoscape from 'components/Cytoscape';
import ActiveCycles from 'components/ActiveCycles';
import PositionWatcher from 'components/position-watcher/PositionWatcher';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      activeExchanges: EXCHANGES,
    };
  }

  componentDidMount() {
    this.props.listen(this.state.activeExchanges);
  }

  render() {
    const globalState = this.state.globalState || {};
    const pairs = Object.keys(globalState);
    const cycles = this.state.cycleResults || [];
    const wins = cycles.reduce((accum, c) => accum + (c.weight > 1? 1 : 0), 0);
    return <div className='app-container'>
      <Helmet>
        <title>{`${wins? `(${wins})` : ''} Botzy`}</title>
      </Helmet>
      <Cytoscape activeExchanges={this.state.activeExchanges} />
      <ActiveCycles />
      <PositionWatcher />
    </div>;
  }

}

const mapStateToProps = state => {
  return {
  };
}

const ConnectedApp = connect(
  mapStateToProps,
  undefined
)(App)


module.exports = ConnectedApp;
