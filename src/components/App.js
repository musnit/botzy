import React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import { Helmet } from 'react-helmet';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.hackRerender = this.hackRerender.bind(this);
    window.hackRerender2 = this.hackRerender2.bind(this);
  }

  hackRerender(globalState) {
    this.setState({ globalState });
  }

  hackRerender2(cycleResults) {
    this.setState({ cycleResults });
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
      {/* <div className='global-state'>
        {pairs.map(pair => <div key={pair}>
          <div>{pair}</div>
          {(!globalState[pair][0].weight || !globalState[pair][1].weight)? 'No pair data for this pair' :
            globalState[pair].map((item, index) => {
              return <div key={index}>{
                `Buy ${pair.slice(0,3)} ${item.buyFrom} sell into ${pair.slice(3)} ${item.sellTo}: ${item.weight}`
              }</div>
            })
          }
          <br />
        </div>)}
      </div> */}
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

const mapStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const ConnectedApp = connect(
  mapStateToProps,
  undefined
)(App)


module.exports = ConnectedApp;
