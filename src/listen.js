import _ from 'lodash';

import helpers from 'helpers';
import adapters from 'adapters';

function updatePairGlobal(pair, pairResults) {
  const cycleResults = helpers.walkCycles(window.cycles, cycleLength);
  const finalCycleResultsAfterFees = helpers.applyFees(cycleResults, cycleLength, 0.998);
  const sortedCycleResults = _.sortBy(finalCycleResultsAfterFees, 'weight').reverse();
  window.hackRerender2 && window.hackRerender2(sortedCycleResults);
}

function updateEdges(pair, exchangeName, data) {
  const currency1 = pair.slice(0,3);
  const currency2 = pair.slice(3);
  const updates = [
    {
      edgeId: `${exchangeName}_${currency1}_${currency2}_m`,
      data: {
        weight: data.askPrice,
        depth: data.askSize,
        heartbeat: data.heartbeat
      },
    }, {
      edgeId: `${exchangeName}_${currency1}_${currency2}_t`,
      data: {
        weight: data.bidPrice,
        depth: data.bidSize,
        heartbeat: data.heartbeat,
      },
    }, {
      edgeId: `${exchangeName}_${currency2}_${currency1}_m`,
      data: {
        weight: 1/data.bidPrice,
        depth: data.bidSize,
        heartbeat: data.heartbeat,
      }
    }, {
      edgeId: `${exchangeName}_${currency2}_${currency1}_t`,
      data: {
        weight: 1/data.askPrice,
        depth: data.askSize,
        heartbeat: data.heartbeat,
      }
    }];
    window.testUpdates && window.testUpdates(updates);
}


export default exchanges => {
  exchanges.forEach(exchange => {
    const adapter = adapters[exchange.adapter];
    adapter(exchange, updateEdges);
  });
};
