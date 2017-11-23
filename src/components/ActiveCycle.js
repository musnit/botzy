import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActiveEdge from './ActiveEdge';

class ActiveCycle extends Component {

  componentDidMount = _ => {
    setInterval(this.forceUpdate.bind(this), 100);
  }

  go = _ => {
    const makerEdge = this.props.cycle.path.find(e => e.data('maker'));
    this.props.addTrigger(makerEdge, this.props.cycle);
  }

  abort = _ => {

  }

  render() {
    const { cycle } = this.props;
    const posi = cycle.result > 1;
    const text = cycle.path.map(edge => edge.data('id')).join(' ');
    return <div
      className='active-cycle'
      style={{ backgroundColor: posi? '#9fff9f' : '#ffb4b4' }}>
      <div>ID: {`${text}`}</div>
      <div>Main Altcoin: {`${cycle.altCurrency}`}</div>
      <div className='active-cycle-returns'>
        <div>
          <label>Current Best Return:</label> <strong>{`${(cycle.result - 1) * 100}%`}</strong>
        </div>
        <div>
          Original Expected Return when started:
        </div>
        <div>
          Current Expected Return:
        </div>
      </div>
      <div className='active-cycle-edge-displays'>
        {cycle.path.map(edge => {
          const edgeId = edge.data('id');
          const edgeKey = edgeId + Math.random();
          return <ActiveEdge edge={edge} key={edgeKey} />;
        })}
      </div>
      <div className='active-cycle-controls'>
        <button onClick={this.go}>Go!</button>
        <button onClick={this.abort}>Abort!</button>
      </div>
    </div>;
  }

}

const mapStateToProps = state => {
  return {
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ }, dispatch)
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveCycle);
