import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ActiveCycle extends Component {

  componentDidMount = _ => {
    setInterval(this.forceUpdate.bind(this), 100);
  }

  render() {
    const { cycle } = this.props;
    const posi = cycle.result > 1;
    const text = cycle.path.map(edge => edge.data('id')).join(' ');
    return <div
      style={{ backgroundColor: posi? '#9fff9f' : '#ffb4b4' }}>
      <div>
        {`${(cycle.result - 1) * 100}% ${text} ${cycle.altCurrency}`}
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
