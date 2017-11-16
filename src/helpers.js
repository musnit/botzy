function createPairGraphForExchange(globalState, exchange) {
  const exchangeState = globalState[exchange];
  const pairs = Object.keys(exchangeState);
  const pairGraph = pairs.reduce((accum, pair) => {
    if(!exchangeState[pair].bidPrice) {
      return accum;
    }
    const currency1 = pair.slice(0,3);
    const currency2 = pair.slice(3);
    accum[currency1] = accum[currency1] || {};
    accum[currency2] = accum[currency2] || {};
    accum[currency1].pairs = accum[currency1].pairs || {};
    accum[currency2].pairs = accum[currency2].pairs || {};
    accum[currency1].pairs[currency2] = { convert: _ => exchangeState[pair].bidPrice };
    accum[currency2].pairs[currency1] = { convert: _ => 1/exchangeState[pair].askPrice };
    return accum;
  }, {});
  return pairGraph;
}

const removePairsWithCodes = (pairs, codes) => _.omitBy(pairs, (pair, filterKey) => {
  const match = codes.includes(filterKey);
  return match;
})

const onlyPairWithCode = (pairs, code) => _.omitBy(pairs, (pair, filterKey) => {
  return filterKey !== code;
})

const removeDeadendPairs = pairs => _.omitBy(pairs, (pair) => {
  return Object.keys(pair).length === 0;
});

const makeNextPairs = (pairs, graph, currencyCodes, currentCycleLength, length) => {
  const lastCurrencyCode = currencyCodes[currencyCodes.length - 1];
  return _.mapValues(pairs, (_, currentCurrencyCode) => {
    let nextPairs = graph[currentCurrencyCode].pairs;
    const isFinalLeg = currentCycleLength === length;
    if (isFinalLeg) {
      nextPairs = onlyPairWithCode(nextPairs, currencyCodes[0]);
    }
    else {
      nextPairs = removePairsWithCodes(nextPairs, currencyCodes);
      const nextCurrencyCodes = currencyCodes.concat(currentCurrencyCode);
      nextPairs = makeNextPairs(nextPairs, graph, nextCurrencyCodes, currentCycleLength + 1, length);
      nextPairs = removeDeadendPairs(nextPairs);
    }
    return {
      convert: _ => graph[lastCurrencyCode].pairs[currentCurrencyCode].convert(),
      pairs: nextPairs
    };
  });
};

const makeCycles = (graph, length) => {
  return _.mapValues(graph, (_, startingCurrencyCode) => {
    let nextPairs = graph[startingCurrencyCode].pairs;
    const currencyCodes = [startingCurrencyCode];
    nextPairs = makeNextPairs(nextPairs, graph, currencyCodes, 2, length);
    return {
      convert: _ => 1,
      pairs: nextPairs
    };
  });
}

const walkNextEdge = (lastNode, currencyFlow, convertedValue, accum, cycleLength, currentWalkLength) => {
  _.map(lastNode.pairs, (currentNode, currentCurrencyCode) => {
    const nextConvertedValue = convertedValue * parseFloat(currentNode.convert());
    if (currentWalkLength === cycleLength) {
      accum[currencyFlow] = nextConvertedValue;
    }
    else {
      const nextCurrencyFlow = currencyFlow + '_' + currentCurrencyCode;
      walkNextEdge(currentNode, nextCurrencyFlow, nextConvertedValue, accum, cycleLength, currentWalkLength + 1);
    }
  });
};

const walkCycles = (cycles, cycleLength) => {
  const firstConvertedValue = 1;
  const currentWalkLength = 1;
  return _.reduce(cycles, (accum, node, currencyFlow) => {
    walkNextEdge(node, currencyFlow, firstConvertedValue, accum, cycleLength, currentWalkLength);
    return accum;
  }, {});
}

const filterDupCycles = (cycles, length) => {
  const cycleKeys = Object.keys(cycles);
  const cycleFlows = cycleKeys.map(key => {
    const currencies = key.split('_');
    const flow = currencies.map((currency, index) => {
      const nextIndex = (index + 1) % length;
      return `${currency}_${currencies[nextIndex]}`;
    });
    return flow.sort().join(' ');
  });
  const indexToFlow = cycleFlows.map((flow, index) => ({ index, flow }));
  const sortedIndexToFlow = indexToFlow.sort((a, b) => a.flow.localeCompare(b.flow));
  const filteredFlows = sortedIndexToFlow.filter((flow, index) => index % length === 0);
  const finalTriangles = filteredFlows.reduce((accum, flow) => {
    const key = cycleKeys[flow.index];
    accum[key] = cycles[key];
    return accum;
  }, {});
  return finalTriangles;
};

const applyFees = (cycles, length, fee) => {
  return _.mapValues(cycles, weight => weight * Math.pow(fee, length));
}

module.exports = {
  createPairGraphForExchange,
  walkCycles,
  makeCycles,
  applyFees,
  filterDupCycles
};
