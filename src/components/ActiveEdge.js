import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import makeRequest from 'adapters/local-server';

const makeLink = (pair) => {
  const currency1 = pair.slice(0, 3);
  const currency2 = pair.slice(3);
  return `https://www.bitfinex.com/t/${currency1.toUpperCase()}:${currency2.toUpperCase()}`
};

class ActiveEdge extends Component {

  go = _ => {
    this.props.addTrigger(this.props.edge, this.props.cycle);
  }

  abort = _ => {
    const orderPayload = {
      request: '/v1/order/cancel',
      nonce: Date.now().toString(),
      order_id: this.props.edge.data('activeOrder').id
    };

    makeRequest('cancel_order', orderPayload)
      .then(response => {
        console.log(response.body);
        this.props.edge.data({ activeOrder: undefined });
        this.props.deactivate(this.props.edge);
      }, error => {
        console.error(error.response.body.message);
      });
  }

  update = _ => {
    const edgeData = this.props.edge.data();
    const activeOrder = edgeData.activeOrder;

    let newPrice;
    if (activeOrder.side === 'sell') {
      newPrice = edgeData.weight;
    }
    else {
      newPrice = 1/edgeData.weight;
    }

    const orderPayload = {
      request: '/v1/order/cancel/replace',
      nonce: Date.now().toString(),
      order_id: activeOrder.id,
      symbol: activeOrder.symbol,
      amount: activeOrder.remaining_amount,
      price: '' + newPrice,
      side: activeOrder.side,
      type: activeOrder.type
    };

    makeRequest('replace_order', orderPayload)
      .then(response => {
        console.log(response.body);
        this.props.edge.data({ activeOrder: response.body });
      }, error => {
        console.error(error.response.body.message);
      });
  }

  render() {
    const { edge } = this.props;
    const idArray = edge.data('id').split('_');
    const exchange = idArray[0];
    const from = idArray[1];
    const to = idArray[2];
    const makerTaker = edge.data('maker') === true? 'Maker' : 'Taker';
    const depth = edge.data('depth');
    const activeOrder = edge.data('activeOrder');
    return <span className='active-edge-display'>
      <div>{exchange}</div>
      <div><a target='_blank' href={makeLink(edge.data('pair'))} >{from} -> {to}</a></div>
      <div>{makerTaker}@{edge.data('price')}</div>
      <div>Depth: {edge.data('depth')}</div>
      <div>Liveness: {(Date.now() - edge.data('heartbeat'))}ms</div>
      {activeOrder && <div>Active Order: {activeOrder.price}</div>}
      <div className='active-edge-controls'>
        {edge.data('maker') && !activeOrder && <button onClick={this.go}>Go!</button>}
        {activeOrder && <button onClick={this.abort}>Abort!</button>}
        {activeOrder && <button onClick={this.update}>Update!</button>}
      </div>
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
