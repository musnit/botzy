//This file finds the ideal position to place an order at, based on the
//edge we are looking at, the cycles it is part of and the order book of that
//edge
import _ from 'lodash';

import { EXCHANGES_BY_NAME } from 'config/exchanges';
import PAIRCODES from 'config/paircodes';

import { containsEdge } from 'helpers/filters';

const findBestCycle = (edge, cycles) => {
  //TODO: optimize performance here with hash/time-space tradeoff
  //TODO: This only really does a basic find. Advanced find would check all potential
  //good positions in the order book, not just the default position.
  const edgeCycles = cycles.filter(containsEdge(edge));
  return _.orderBy(edgeCycles, 'result', 'desc')[0];
};

const findOrderSize = edge => {
  //TODO: something more clever here
  return '' + 2;
};

const findOrderSide = edge => {
  const pairFirst = edge.pair.slice(0,3);
  if (pairFirst === edge.source) {
    //we are converting in normal direction, ie, selling, ie, asking
    return 'sell';
  }
  else {
    //bidding
    return 'buy';
  }
};

const findOrderPrice = (edge, side) => {
  if (side === 'sell') {
    return '' + edge.weight;
  }
  else {
    return '' + 1/edge.weight;
  }
};

export default (edge, cycles) => {
  const symbol = PAIRCODES[edge.exchange][edge.pair];
  const symbolDetails = EXCHANGES_BY_NAME[edge.exchange].symbolDetails[symbol];

  const bestCycle = findBestCycle(edge, cycles);
  const result = bestCycle.result;

  const amount = findOrderSize(edge);
  const side = findOrderSide(edge);
  const price = findOrderPrice(edge, side);

  return {
   symbol,
   amount,
   price,
   side,
   exchange: edge.exchange
  };
};
