import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { addActiveCycle } from 'ducks/active-cycles';

class Cycle extends Component {

  render() {
    const { cycle } = this.props;
    const posi = cycle.result > 1;
    const text = cycle.path.map(edge => edge.data('id')).join(' ');
    return <div onClick={_ => this.props.addActiveCycle(cycle)}
      style={{ backgroundColor: posi? '#9fff9f' : '#ffb4b4' }}>
      <div>
        {/* <span className='cycle-heartbeats'>
          {cycle.heartbeats.map((h, index) => {
            const timePassed = Math.min(h/2000, 1) * 240;
            const r = parseInt(timePassed);
            const g = parseInt(240 - timePassed);
            return <span key={index}
              className='cycle-heartbeat'
              style={{ backgroundColor: `rgba(${r}, ${g}, 0, 1)` }} >
            </span>;
          })}
        </span> */}
        {`${(cycle.result - 1) * 100}% ${text} ${cycle.altCurrency}`}
      </div>
    </div>;
  }

}

const mapStateToProps = state => {
  return {
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ addActiveCycle }, dispatch)
}

const ConnectedCycle = connect(
  mapStateToProps,
  mapDispatchToProps
)(Cycle)

module.exports = ConnectedCycle;
