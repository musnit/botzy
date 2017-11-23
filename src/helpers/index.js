import { maxDistance } from 'config/misc';

export { createEdgesForExchanges, createEdgesForPair } from './create-edges-for-exchanges';
export filters from './filters';

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

const findCyclesFromNode = (startingNode, path, cycles) => {
  const previousNode = path.length === 0? startingNode : path[path.length - 1].target();
  const nextEdges = previousNode.outgoers(e => e.isEdge());
  //check destination of edge - if it is the start, then add it as cycle and stop pursuing this path.
  //check lenght, if it is too long, then stop pursuing this path
  //otherwise, span out to new next edges
  nextEdges.forEach(edge => {
    const target = edge.target();
    const newPath = path.concat(edge);

    if (target === startingNode) {
      cycles.push({ path: newPath });
      return;
    }
    else if (newPath.length === maxDistance) {
      return;
    }
    else {
      findCyclesFromNode(startingNode, newPath, cycles);
    }
  });
}

export const findCyclesForGraph = (graph, length) => {
  const nodes = graph.nodes();
  let cycles = [];
  nodes.reduce(accum => {
    const firstNode = accum[0];
    findCyclesFromNode(firstNode, [], cycles);
    return accum.difference(firstNode);
  }, nodes);
  cycles.forEach(cycle => {
    const fee = cycle.path.reduce((accum, edge) => {
      const edgeFee = edge.data('fee');
      return accum * edgeFee;
    }, 1);
    cycle.fee = fee;
  });
  return cycles;
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

export default {
  walkCycles,
  applyFees,
  filterDupCycles
};
