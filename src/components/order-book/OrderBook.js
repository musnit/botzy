import React, { Component } from 'react';

import OrderBookSide from './OrderBookSide';
import './order-book.css';

class OrderBook extends Component {

  render() {
    const { book } = this.props;
    return <div className='order-book'>
      <OrderBookSide items={book.processedBids} type='bids' />
      <OrderBookSide items={book.processedAsks} type='asks' />
    </div>;
  }

}

export default OrderBook;
