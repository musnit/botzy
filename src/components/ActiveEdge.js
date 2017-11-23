import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const makeLink = (pair) => {
  const currency1 = pair.slice(0, 3);
  const currency2 = pair.slice(3);
  return `https://www.bitfinex.com/t/${currency1.toUpperCase()}:${currency2.toUpperCase()}`
};

class ActiveEdge extends Component {

  render() {
    const { edge } = this.props;
    const idArray = edge.data('id').split('_');
    const exchange = idArray[0];
    const from = idArray[1];
    const to = idArray[2];
    const makerTaker = edge.data('maker') === true? 'Maker' : 'Taker';
    const depth = edge.data('depth');
    return <span className='active-edge-display'>
      <div>{exchange}</div>
      <div><a target='_blank' href={makeLink(edge.data('pair'))} >{from} -> {to}</a></div>
      <div>{makerTaker}@{edge.data('weight')}</div>
      <div>Depth: {edge.data('depth')}</div>
      <div>Liveness: {(Date.now() - edge.data('heartbeat'))}ms</div>
    </span>;
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
)(ActiveEdge);
