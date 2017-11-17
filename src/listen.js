import _ from 'lodash';

import helpers from 'helpers';
import adapters from 'adapters';

function updatePairGlobal(pair, pairResults) {
  const cycleResults = helpers.walkCycles(window.cycles, cycleLength);
  const finalCycleResults = helpers.filterDupCycles(cycleResults, cycleLength);
  const finalCycleResultsAfterFees = helpers.applyFees(finalCycleResults, cycleLength, 0.998);
  const sortedCycleResults = _.sortBy(finalCycleResultsAfterFees, 'weight').reverse();
  window.hackRerender2 && window.hackRerender2(sortedCycleResults);
}

function updateEdges(pair, exchangeName, data) {
  return;
  const currency1 = pair.slice(0,3);
  const currency2 = pair.slice(3);
  window.cytoStuff = window.cytoStuff || {};
  window.cytoStuff[exchangeName] = window.cytoStuff[exchangeName] || {};
  window.cytoStuff[exchangeName][pair] = window.cytoStuff[exchangeName][pair] || {};
  const edges = window.cytoStuff[exchangeName][pair].edges;
  if(edges) {
    //update
  }
  else {
    const newEdges = [
      {
        data: {
          id: `${exchangeName}_${currency1}_${currency2}_m`,
          length: data.askPrice,
          depth: data.askSize,
          heartbeat: data.heartbeat
        },
      }, {
        data: {
          id: `${exchangeName}_${currency1}_${currency2}_t`,
          length: data.bidPrice,
          depth: data.bidSize,
          heartbeat: data.heartbeat,
        },
      }, {
        data: {
          id: `${exchangeName}_${currency2}_${currency1}_m`,
          length: 1/data.bidPrice,
          depth: data.bidSize,
          heartbeat: data.heartbeat,
        }
      }, {
        data: {
          id: `${exchangeName}_${currency2}_${currency1}_t`,
          length: 1/data.askPrice,
          depth: data.askSize,
          heartbeat: data.heartbeat,
    }}];
    window.cytoStuff[exchangeName][pair].edges = newEdges;
    window.addEdges && window.addEdges(newEdges);
  }
}


export default exchanges => {
  exchanges.forEach(exchange => {
    const adapter = adapters[exchange.adapter];
    adapter(exchange, updateEdges);
  });
};
