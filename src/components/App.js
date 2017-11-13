import React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';

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
    const cycleResults = this.state.cycleResults || {};
    const mappedCycleResults = _.map(cycleResults, (value, key) => ({ text: key, weight: value }));
    const sortedCycleResults = _.sortBy(mappedCycleResults, 'weight').reverse();
    return <div className='app-container'>
      <div className='global-state'>
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
      </div>
      <div className='triangle-results'>
        {sortedCycleResults.map(cycle => {
          const cycleText = cycle.text.split('_').join(' -> ');
          return <div key={cycle.text}>
            <div>{`${cycleText}: ${cycle.weight} ${(cycle.weight - 1) * 100}%`}</div>
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
