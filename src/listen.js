import _ from 'lodash';

import PAIRS from 'config/pairs';
import EXCHANGES from 'config/exchanges';
import FEES from 'config/fees';

import helpers from 'helpers';
import adapters from 'adapters';

const activeChannels = {};
const globalHeartbeats = {};

const exchangeTodo = 'bitfinex';
const activeExchanges = [exchangeTodo];
const cycleLength = 3;

function compareForPair(pairStateOne, pairStateTwo) {
  const result = [{
    buyFrom: pairStateOne.exchange.name,
    sellTo: pairStateTwo.exchange.name,
  }, {
    buyFrom: pairStateTwo.exchange.name,
    sellTo: pairStateOne.exchange.name,
  }];
  const stateOne =  pairStateOne.state;
  const stateTwo =  pairStateTwo.state;
  if(stateOne && stateTwo) {
    const feesOne = FEES[pairStateOne.exchange.name].fee;
    const feesTwo = FEES[pairStateTwo.exchange.name].fee;
    const buy1Sell2 = ((stateTwo.bidPrice * feesTwo) - stateOne.askPrice) * feesOne;
    const buy2Sell1 = ((stateOne.bidPrice * feesOne) - stateTwo.askPrice) * feesTwo;
    result[0].weight = buy1Sell2/stateOne.askPrice*100;
    result[1].weight = buy2Sell1/stateTwo.askPrice*100;
  }
  return result;
}

function calcBoth(pair, globalState) {
  const statesForPair = activeExchanges.map(exchangeKey => {
    const exchange = EXCHANGES[exchangeKey];
    return {
      exchange,
      state: globalState[exchange.name][pair]
    };
  });
  let pairResults = [];
  for(let i = 0; i < statesForPair.length - 1; i++) {
    for(let j = i + 1; j < statesForPair.length; j++) {
      const pairStateOne = statesForPair[i];
      const pairStateTwo = statesForPair[j];
      pairResults = pairResults.concat(compareForPair(pairStateOne, pairStateTwo));
    }
  }
  updatePairGlobal(pair, pairResults);
}

window.cycles = undefined;
const setCycles = cycles => {
  window.cycles = cycles;
};

function findCycles(cycleLength) {
  const graph = helpers.createPairGraphForExchange(globalState, exchangeTodo);
  const cycles = helpers.makeCycles(graph, cycleLength);
  return cycles;
}

function makeHeartbeats(key) {
  const keys = key.split('_');
  const heartbeats = keys.map((key, index) => {
    const nextIndex = (index + 1) % keys.length;
    const pair1 = key.concat(keys[nextIndex]);
    const pair2 = keys[nextIndex].concat(key);
    const heartbeat = globalHeartbeats[exchangeTodo][pair2] || globalHeartbeats[exchangeTodo][pair1];
    return Date.now() - heartbeat;
  });
  return heartbeats;
}

function addHeartbeats(cycleResults = {}) {
  return _.map(cycleResults, (value, key) => ({
    text: key.split('_').join(' -> '),
    weight: value,
    heartbeats: makeHeartbeats(key)
  }));
}

function updatePairGlobal(pair, pairResults) {
  // window.globalPairs[pair] = pairResults;
  // window.hackRerender && window.hackRerender(window.globalPairs);
  const cycleResults = helpers.walkCycles(window.cycles, cycleLength);
  const finalCycleResults = helpers.filterDupCycles(cycleResults, cycleLength);
  const finalCycleResultsAfterFees = helpers.applyFees(finalCycleResults, cycleLength, 0.998);
  const finalCycleResultsAfterFeesWithHeartbeats = addHeartbeats(finalCycleResultsAfterFees);
  const sortedCycleResults = _.sortBy(finalCycleResultsAfterFeesWithHeartbeats, 'weight').reverse();
  window.hackRerender2 && window.hackRerender2(sortedCycleResults);
}

function updateCy(pair, exchangeName, data) {
  const currency1 = pair.slice(0,3);
  const currency2 = pair.slice(3);
  const bidPrice = data[1];
  const bidSize = data[2];
  const askPrice = data[3];
  const askSize = data[4];
  const heartbeat = Date.now();
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
          source: currency1,
          target: currency2,
          maker: true,
          exchange: exchangeName,
          length: askPrice,
          depth: askSize,
          heartbeat,
          label: `${exchangeName}_m`
        },
      }, {
        data: {
          id: `${exchangeName}_${currency1}_${currency2}_t`,
          source: currency1,
          target: currency2,
          maker: false,
          exchange: exchangeName,
          length: bidPrice,
          depth: bidSize,
          heartbeat
        },
      }, {
        data: {
          id: `${exchangeName}_${currency2}_${currency1}_m`,
          source: currency2,
          target: currency1,
          maker: true,
          exchange: exchangeName,
          length: 1/bidPrice,
          depth: bidSize,
          heartbeat
        }
      }, {
        data: {
          id: `${exchangeName}_${currency2}_${currency1}_t`,
          source: currency2,
          target: currency1,
          maker: false,
          exchange: exchangeName,
          length: 1/askPrice,
          depth: askSize,
          heartbeat
    }}];
    window.cytoStuff[exchangeName][pair].edges = newEdges;
    window.addEdges && window.addEdges(newEdges);
  }
}


module.exports = (globalState, globalPairs) => {
  activeExchanges.forEach(exchangeKey => {
    const exchange = EXCHANGES[exchangeKey];
    const adapter = adapters[exchange.adapter];
    adapter(exchange.name, calcBoth, globalState, activeChannels, globalHeartbeats, setCycles, updateCy);
  });
}
