import React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';

class Stats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.hackRerender = this.setState.bind(this);
  }

  render() {
    const pairs = Object.keys(this.state);
    return <div>
      {pairs.map(pair => <div key={pair}>
        <div>{pair}</div>
        {(!this.state[pair][0].weight || !this.state[pair][1].weight)? 'No pair data for this pair' :
          this.state[pair].map((item, index) => {
            return <div key={index}>{
              `Buy ${pair.slice(0,3)} ${item.buyFrom} sell into ${pair.slice(3)} ${item.sellTo}: ${item.weight}`
            }</div>
          })
        }
        <br />
      </div>)}
    </div>;
  }

}

const mapStateToProps = (state) => {
  return {
    todos: state.todos
  }
}

const ConnectedStats = connect(
  mapStateToProps,
  undefined
)(Stats)


module.exports = ConnectedStats;
