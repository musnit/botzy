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
      className='active-cycle'
      style={{ backgroundColor: posi? '#9fff9f' : '#ffb4b4' }}>
      <div>ID: {`${text}`}</div>
      <div>Main Altcoin: {`${cycle.altCurrency}`}</div>
      <div className='active-cycle-edge-displays'>
        {cycle.path.map(edge => {
          const idArray = edge.data('id').split('_');
          const exchange = idArray[0];
          const from = idArray[1];
          const to = idArray[2];
          const makerTaker = edge.data('maker') === true? 'Maker' : 'Taker';
          const depth = edge.data('depth');
          return <span key={edge.data('id')} className='active-edge-display'>
            <div>{exchange}</div>
            <div>{from} -> {to}</div>
            <div>{makerTaker}@{edge.data('weight')}</div>
            <div>Depth: {edge.data('depth')}</div>
            <div>Liveness: {(Date.now() - edge.data('heartbeat'))}ms</div>
          </span>;
        })}
      </div>
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
