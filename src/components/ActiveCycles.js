import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActiveCycle from './ActiveCycle';
import { EXCHANGES_BY_NAME } from 'config/exchanges';

import makeRequest from 'adapters/local-server';

class ActiveCycles extends Component {
  activeTriggers = {}
  state = {}

  constructor(props) {
    super(props);
    window.checkTriggers = this.checkTriggers;
  }

  addTrigger = (edge) => {
    const edgeId = edge.data('id');
    console.log(`Trigger set for ${edgeId}`);
    this.activeTriggers[edgeId] = edge;
  }

  checkTriggers = updates => {
    updates.forEach(update => {
      const edgeToTrigger = this.activeTriggers[update.data.id];
      if(edgeToTrigger) {
        this.triggerEdge(edgeToTrigger);
      }
    });
  }

  triggerEdge = edge => {
    try {
      const edgeData = edge.data();
      console.log(`Looking at triggering ${edgeData.id} with ${JSON.stringify(edgeData)}`);
      this.activeTriggers[edgeData.id] = undefined;

      //TODO: check edge is stil good in *SOME* cycle

      //TODO: calculate max order size can do

      //calculate min order size can do
      //go with min for now
      const symbolDetails = EXCHANGES_BY_NAME[edgeData.exchange].symbolDetails[edgeData.pair];
      const orderSize = symbolDetails.minimum_order_size * 3;

      //calculate bid or ask type
      console.log(orderSize);
      console.log(edgeData);
      const pairFirst = edgeData.pair.slice(0,3);
      let side, price;
      if (pairFirst === edgeData.source) {
        //we are converting in normal direction, ie, selling, ie, asking
        side = 'sell';
        price = edgeData.weight;
      }
      else {
        //bidding
        side = 'buy';
        price = 1/edgeData.weight;
      }

      const orderPayload = {
       request: '/v1/order/new',
       nonce: Date.now().toString(),
       //TODO: should do map/inverse pair map here
       symbol: edgeData.pair,
       amount: '' + orderSize,
       price: '' + price,
       exchange: 'bitfinex',
       side,
       type: 'exchange limit'
      };

      makeRequest('new_order', orderPayload)
        .then(response => {
          console.log(response);
          console.log(response.body);
          edge.data({ activeOrder: response.body });
        }, error => {
          alert(error.response.body.message);
        });

      //make limit order, then success => watch / fail => error
      //then implement abort
      //then implement watch and autoabort
      //then implment watch and success and automake market ordersx2 with promise success => yay, 1xfail => error, 2xfail => error

    }
    catch(error) {
      console.warn(error.message);
    }
  }

  render() {
    const { cycles } = this.props;
    return <div className='active-cycles'>
      <h2>Active Cycles:</h2>
      {cycles.map((cycle, index) => <ActiveCycle addTrigger={this.addTrigger} key={index} cycle={cycle} />)}
    </div>;
  }

}

const mapStateToProps = state => {
  return {
    cycles: state.activeCycles
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ActiveCycles)
