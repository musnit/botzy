import Paircodes from 'config/paircodes';
import _ from 'lodash';

const EXCHANGES = [
  {
    name: 'bitfinex',
    adapter: 'ws',
    adapterConfig: {
      wsURL: 'wss://api.bitfinex.com/ws/',
      channelName: 'ticker',
      eventName: 'subscribe',
      pairNameMapping: pair => Paircodes.bitfinex[pair]
    },
    fees: {
      maker: 1 - 0.1/100,
      taker: 1 - 0.2/100
    }
  },
{
    name: 'bitstamp',
    adapter: 'pusher',
    adapterConfig: {
      pusherAppKey: 'de504dc5763aeef9ff52',
      eventName: 'data',
      pairNameMapping: pair => Paircodes.bitstamp[pair]
    },
    fees: {
      maker: 1 - 0.25/100,
      taker: 1 - 0.25/100
    }
  }
];

export default EXCHANGES;
export const EXCHANGES_BY_NAME =  _.keyBy(EXCHANGES, 'name');
