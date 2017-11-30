import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActiveCycle from './ActiveCycle';

import makeRequest from 'adapters/local-server';
import findPosition from 'helpers/position-finder';

class ActiveCycles extends Component {
  activeTriggers = {}
  activeEdges = {}
  state = {}

  constructor(props) {
    super(props);
    window.checkTriggers = this.checkTriggers;
    window.checkActives = this.checkActives;
  }

  deactivate = edge => {
    this.activeEdges[edge.data('id')] = undefined;
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

  checkActives = updates => {
    updates.forEach(update => {
      const activeEdge = this.activeEdges[update.data.id];
      if(activeEdge) {
        this.checkActive(activeEdge);
      }
    });
  }

  checkActive = edge => {
    console.log(`${edge.data('id')} is active and just got new data`);
    this.updateActive(edge);
  }

  updateActive = edge => {
    const edgeData = edge.data();
    if(edgeData.exchange !== 'bitfinex') {
      return;
    }
    const activeOrder = edgeData.activeOrder;

    let newPrice;
    if (activeOrder.side === 'sell') {
      newPrice = edgeData.weight;
    }
    else {
      newPrice = 1/edgeData.weight;
    }

    const orderPayload = {
      id: activeOrder.id,
      symbol: activeOrder.symbol,
      amount: activeOrder.remaining_amount,
      price: '' + newPrice,
      side: activeOrder.side,
      type: activeOrder.type,
      exchange: edgeData.exchange
    };

    makeRequest('replace_limit_order', orderPayload)
      .then(response => {
        console.log(response.body);
        edge.data({ activeOrder: response.body });
      }, error => {
        console.error(error.response.body.message);
      });
  }

  triggerEdge = edge => {
    try {
      const edgeData = edge.data();
      console.log(`Looking at triggering ${edgeData.id} with ${JSON.stringify(edgeData)}`);
      this.activeTriggers[edgeData.id] = undefined;

      const orderPayload = findPosition(edgeData, this.props.cycles);

      makeRequest('new_limit_order', orderPayload)
        .then(response => {
          console.log(response);
          console.log(response.body);
          edge.data({ activeOrder: response.body });
          this.activeEdges[edgeData.id] = edge;
        }, error => {
          console.error(error.response.body.message);
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
      {cycles.map((cycle, index) => <ActiveCycle deactivate={this.deactivate} addTrigger={this.addTrigger} key={index} cycle={cycle} />)}
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
