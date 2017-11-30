import React, { Component } from 'react';

class OrderBookSide extends Component {

  render() {
    const { items, type } = this.props;
    const typeClass = type === 'bids'? 'order-book-bids' : 'order-book-asks';
    const header = type === 'bids'? 'Bids' : 'Asks';
    return <div className={`order-book-side ${typeClass}`}>
      <div className='order-book-header'>
        {header}
      </div>
      {items.slice(0,5).map(item => <div key={item.price} className='order-book-row'>
        <div className='order-book-price'>{item.price}</div>
        <div className='order-book-total-volume'>{item.totalVolume.toFixed(2)}</div>
      </div>)}
    </div>;
  }

}

export default OrderBookSide;
