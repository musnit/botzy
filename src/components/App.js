import React from 'react';
import { connect } from 'react-redux';
import { createStore } from 'redux';

class Stats extends React.Component {

  render() {
    return <div>
      {JSON.stringify(this.props.todos)}
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
