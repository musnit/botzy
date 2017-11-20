import React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import { Helmet } from 'react-helmet';

import Cytoscape from './Cytoscape';
import EXCHANGES from 'config/exchanges';

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
      <div className='triangle-results'>
        {cycles.map(cycle => {
          const posi = cycle.weight > 1;
          return <div style={{ backgroundColor: posi? '#9fff9f' : '#ffb4b4' }} key={cycle.text}>
            <div>
              <span className='cycle-heartbeats'>
                {cycle.heartbeats.map((h, index) => {
                  const timePassed = Math.min(h/2000, 1) * 240;
                  const r = parseInt(timePassed);
                  const g = parseInt(240 - timePassed);
                  return <span key={index}
                    className='cycle-heartbeat'
                    style={{ backgroundColor: `rgba(${r}, ${g}, 0, 1)` }} >
                  </span>;
                })}
              </span>
              {`${cycle.text}: ${cycle.weight} ${(cycle.weight - 1) * 100}%`}
            </div>
          </div>
        })}
      </div>
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
