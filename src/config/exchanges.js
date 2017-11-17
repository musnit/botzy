import Paircodes from 'config/paircodes';

const EXCHANGES = [
  {
    name: 'bitfinex',
    adapter: 'ws',
    adapterConfig: {
      wsURL: 'wss://api.bitfinex.com/ws/',
      channelName: 'ticker',
      eventName: 'subscribe',
      pairNameMapping: pair => Paircodes.bitfinex[pair]
    }
  },
{
    name: 'bitstamp',
    adapter: 'pusher',
    adapterConfig: {
      pusherAppKey: 'de504dc5763aeef9ff52',
      eventName: 'data',
      pairNameMapping: pair => Paircodes.bitstamp[pair]
    }
  }
];

module.exports = EXCHANGES;
