import Paircodes from 'config/paircodes';
import BitfinexSymbolDetails from 'config/bitfinex-symbol-details';

import LUNO_SECRETS from 'secrets/luno.js';

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
    },
    symbolDetails: BitfinexSymbolDetails
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
  },
  {
    name: 'luno',
    adapter: 'luno',
    adapterConfig: {
      wsURL: 'wss://ws.luno.com/api/1/stream/',
      api_key_id: LUNO_SECRETS.api_key_id,
      api_key_secret: LUNO_SECRETS.api_key_secret,
      pairNameMapping: pair => Paircodes.luno[pair]
    },
    fees: {
      maker: 1 - 0/100,
      taker: 1 - 1/100
    }
  }
];

export default EXCHANGES;
export const EXCHANGES_BY_NAME =  _.keyBy(EXCHANGES, 'name');
