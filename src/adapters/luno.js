import _ from 'lodash';

import EXCHANGES from 'config/exchanges';
import PAIRS from 'config/pairs';

import PAIRCODES, { INVERTED_PAIRCODES } from 'config/paircodes';
import WebSocket from 'lib/web-socket';

function startForPair(pair, wsConfig, wsURL, exchange, updateEdges) {
  const pairName = wsConfig.pairNameMapping(pair);
  if (!pairName) {
    return;
  }
  const pairURL = wsURL + pairName;
  const wss = new WebSocket(pairURL);

  wss.onopen = () => {
    wss.send(JSON.stringify({
      "api_key_id": wsConfig.api_key_id,
      "api_key_secret": wsConfig.api_key_secret,
    }));
  }

  wss.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    const orderBook = data;
    orderBook.heartbeat = Date.now();
    const groupedAsks = _.groupBy(orderBook.asks, ask => parseFloat(ask.price));
    const mappedGroupedAsks = _.map(groupedAsks, askGroup => ({
      price: askGroup[0].price,
      totalVolume: _.reduce(askGroup, (accum, ask) => accum + parseFloat(ask.volume), 0),
      asks: askGroup
    }));
    const groupedBids = _.groupBy(orderBook.bids, bid => parseFloat(bid.price));
    const mappedGroupedBids = _.map(groupedBids, bidGroup => ({
      price: bidGroup[0].price,
      totalVolume: _.reduce(bidGroup, (accum, bid) => accum + parseFloat(bid.volume), 0),
      bids: bidGroup
    }));
    orderBook.processedAsks = _.sortBy(mappedGroupedAsks, askGroup => parseFloat(askGroup.price));
    orderBook.processedBids = _.sortBy(mappedGroupedBids, bidGroup => parseFloat(bidGroup.price)).reverse();
    const pairData = {
      bidPrice: orderBook.processedBids[0].price,
      bidSize: orderBook.processedBids[0].totalVolume,
      askPrice: orderBook.processedAsks[0].price,
      askSize: orderBook.processedAsks[0].totalVolume,
      orderBook,
      heartbeat: Date.now()
    };
    orderBook.asksById = _.keyBy(orderBook.asks, 'id');
    orderBook.bidsById = _.keyBy(orderBook.bids, 'id');
    updateEdges(pair, exchange.name, pairData);
    wss.close();
    setTimeout(arg => startForPair(pair, wsConfig, wsURL, exchange, updateEdges), 5000);
  }
}

export default function start(exchange, updateEdges) {
  const wsConfig = exchange.adapterConfig;
  const wsURL = wsConfig.wsURL;
  PAIRS.forEach(pair => startForPair(pair, wsConfig, wsURL, exchange, updateEdges));
};

// else {
//   console.log('updating book');
//   console.log(data);
//   const orderBook = activePairs[pair].orderBook;
//   if(data === "") {
//     orderBook.heartbeat = Date.now();
//     console.log('only heartbeat updated');
//   }
//   else {
//     if (data.delete_update) {
//       const deletedId = data.delete_update.order_id;
//       console.log(`delete ${deletedId}`);
//       console.log(orderBook.asksById[deletedId]);
//       console.log(orderBook.bidsById[deletedId]);
//       // orderBook.asksById[deletedId] = undefined;
//       // orderBook.bidsById[deletedId] = undefined;
//       // orderBook.asks = _.filter(orderBook.asks, ask => ask.id === deletedId);
//       // orderBook.bids = _.filter(orderBook.bids, bid => bid.id === deletedId);
//       orderBook.heartbeat = Date.now();
//     }
//     if (data.create_update) {
//       const createdId = data.create_update.order_id;
//       console.log(`create ${createdId}`);
//       console.log(orderBook.asksById[createdId]);
//       console.log(orderBook.bidsById[createdId]);
//       //dostuff
//       orderBook.heartbeat = Date.now();
//     }
//     if(data.trade_updates) {
//       console.log('trade updates');
//       console.log(data.trade_updates);
//       data.trade_updates.forEach(update => {
//         const updateId = update.order_id;
//         console.log(orderBook.asksById[updateId]);
//         console.log(orderBook.bidsById[updateId]);
//       });
//       //do stuff
//     }
//     //update book
//     console.log('updated book');
//     console.log(' ');
//     console.log(' ');
//   }
// }
