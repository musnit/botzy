import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ActiveCycle from './ActiveCycle';

class ActiveCycles extends Component {

  render() {
    const { cycles } = this.props;
    return <div>
      <h2>Active Cycles:</h2>
      {cycles.map((cycle, index) => <ActiveCycle key={index} cycle={cycle} />)}
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
