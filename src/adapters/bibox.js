import _ from 'lodash';
import request from 'superagent';

import EXCHANGES from 'config/exchanges';
import PAIRS from 'config/pairs';

import PAIRCODES, { INVERTED_PAIRCODES } from 'config/paircodes';

function processPair(pair, config, exchange, updateEdges) {
  const pairName = config.pairNameMapping(pair);
  if (!pairName) {
    return;
  }
  const url = `${config.url}${pairName}`;
  request.get(url).end((err, res) => {
    const pairRawData = res.body && res.body.result;
    if (!pairRawData) {
      return;
    }
    const pairData = {
      bidPrice: pairRawData.buy,
      bidSize: 0,
      askPrice: pairRawData.sell,
      askSize: 0,
      heartbeat: Date.now()
    };
    updateEdges(pair, exchange.name, pairData);
    setTimeout(_ => processPair(pair, config, exchange, updateEdges), 10000);
  });
}

export default function start(exchange, updateEdges) {
  const config = exchange.adapterConfig;
  const url = config.url;
  PAIRS.forEach(pair => processPair(pair, config, exchange, updateEdges));
};
