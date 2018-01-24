import Paircodes from 'config/paircodes';
import BitfinexSymbolDetails from 'config/bitfinex-symbol-details';
import LunoSymbolDetails from 'config/luno-symbol-details';

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
    symbolDetails: BitfinexSymbolDetails,
    makeLink: (currency1, currency2) => `https://www.bitfinex.com/t/${currency1.toUpperCase()}:${currency2.toUpperCase()}`
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
      maker: 1 - 0.24/100,
      taker: 1 - 0.24/100
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
      taker: 1 - 0.25/100
    },
    symbolDetails: LunoSymbolDetails
  },
  {
    name: 'bibox',
    adapter: 'bibox',
    adapterConfig: {
      url: 'https://api.bibox.com/v1/mdata?cmd=ticker&pair=',
      pairNameMapping: pair => Paircodes.bibox[pair]
    },
    fees: {
      maker: 1 - 0/100,
      taker: 1 - 0.1/100
    },
    makeLink: (currency1, currency2) => `https://www.bibox.com/exchange?coinPair=${currency1.toUpperCase()}_${currency2.toUpperCase()}`
  },
];

export default EXCHANGES;
export const EXCHANGES_BY_NAME =  _.keyBy(EXCHANGES, 'name');
