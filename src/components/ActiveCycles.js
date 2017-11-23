import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActiveCycle from './ActiveCycle';

class ActiveCycles extends Component {
  activeTriggers = {}
  state = {}

  constructor(props) {
    super(props);
    window.checkTriggers = this.checkTriggers;
  }

  addTrigger = (edge, cycle) => {
    const edgeId = edge.data('id');
    console.log(`Trigger set for ${edgeId} on cycle`);
    this.activeTriggers[edgeId] = { edge, cycle };
  }

  checkTriggers = updates => {
    updates.forEach(update => {
      const cycleEdgeToTrigger = this.activeTriggers[update.data.id];
      if(cycleEdgeToTrigger) {
        this.triggerEdge(cycleEdgeToTrigger);
      }
    });
  }

  triggerEdge = cycleEdge => {
    try {
      const edgeData = cycleEdge.edge.data();
      console.log(`Looking at triggering ${edgeData.id} with ${JSON.stringify(edgeData)}`);
      this.activeTriggers[edgeData.id] = undefined;

      //check cycle is stil good
      const result = cycleEdge.cycle.result;
      console.log(`Cycle return is now at: ${result}`);
      if (result > 1.001) {
        console.log(`Result looks above 0.1, continuing`);
      }
      else {
        throw new Error(`Result dropped below 0.1, aborting`);
      }
      //calculate max volume can do
      //calculate min volume can do
      //go with min for now
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
