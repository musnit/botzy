import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class PositionWatcher extends Component {

  render() {
    return <div className='position-watcher'>
      Position Watcher
    </div>;
  }

}

const mapStateToProps = state => {
  return {
  };
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ }, dispatch)
}

const ConnectedPositionWatcher = connect(
  mapStateToProps,
  mapDispatchToProps
)(PositionWatcher)

module.exports = ConnectedPositionWatcher;
