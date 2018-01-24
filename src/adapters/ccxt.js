import _ from 'lodash';
import ccxt from 'ccxt';

import PAIRS from 'config/pairs';

function processPair(pair, exchangeConfig, tickers, updateEdges) {
  const pairName = exchangeConfig.adapterConfig.pairNameMapping(pair, exchangeConfig);
  if (!pairName) {
    return;
  }
  const pairRawData = tickers[pairName];
  if (!pairRawData) {
    return;
  }
  const pairData = {
    bidPrice: pairRawData.bid,
    bidSize: 0,
    askPrice: pairRawData.ask,
    askSize: 0,
    heartbeat: pairRawData.timestamp
  };
  updateEdges(pair, exchangeConfig.name, pairData);
}

function updateTickers(exchange, exchangeConfig, updateEdges) {
  exchange.fetch_tickers().then(tickers => {
    PAIRS.forEach(pair => processPair(pair, exchangeConfig, tickers, updateEdges));
  });
  setTimeout(_ => updateTickers(exchange, exchangeConfig, updateEdges), 6000);
}

export default function start(exchangeConfig, updateEdges) {
  const exchange = new ccxt[exchangeConfig.name]();
  return exchange.loadMarkets().then(_ => {
    exchangeConfig.markets = Object.keys(exchange.markets);
    updateTickers(exchange, exchangeConfig, updateEdges);
  });
};
