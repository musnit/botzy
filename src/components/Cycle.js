import React, { Component } from 'react';

class Cycle extends Component {

  render() {
    const { cycle } = this.props;
    const posi = cycle.result > 1;
    const text = cycle.path.map(edge => edge.data('id')).join(' ');
    return <div style={{ backgroundColor: posi? '#9fff9f' : '#ffb4b4' }}>
      <div>
        {/* <span className='cycle-heartbeats'>
          {cycle.heartbeats.map((h, index) => {
            const timePassed = Math.min(h/2000, 1) * 240;
            const r = parseInt(timePassed);
            const g = parseInt(240 - timePassed);
            return <span key={index}
              className='cycle-heartbeat'
              style={{ backgroundColor: `rgba(${r}, ${g}, 0, 1)` }} >
            </span>;
          })}
        </span> */}
        {`${cycle.result} ${(cycle.result - 1) * 100}% ${text} ${cycle.altCurrency}`}
      </div>
    </div>;
  }

}

export default Cycle;
