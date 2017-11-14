const Paircodes = require('./paircodes');

const EXCHANGES = {
  bitfinex: {
    name: 'bitfinex',
    adapter: 'ws',
    adapterConfig: {
      wsURL: 'wss://api.bitfinex.com/ws/',
      channelName: 'ticker',
      eventName: 'subscribe',
      pairNameMapping: pair => Paircodes.bitfinex[pair]
    }
  },
  bitstamp: {
    name: 'bitstamp',
    adapter: 'pusher',
    adapterConfig: {
      pusherAppKey: 'de504dc5763aeef9ff52',
      eventName: 'data',
      channelNameMapping: pair => `order_book${Paircodes.bitstamp[pair]}`
    }
  }
};

module.exports = EXCHANGES;
