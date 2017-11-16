import helpers from './helpers';

const Pusher = require('pusher-js');
// const WebSocket = require('ws');
const _ = require('lodash');

const Paircodes = require('./config/paircodes');
const PAIRS = require('./config/pairs');
const EXCHANGES = require('./config/exchanges');

const InvertedPaircodes = _.mapValues(Paircodes, codes => _.invert(codes));

const Fees = require('./config/fees');

const adapters = {
  ws: startWSExchange,
  pusher: startPusherExchange
};

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
    const feesOne = Fees[pairStateOne.exchange.name].fee;
    const feesTwo = Fees[pairStateTwo.exchange.name].fee;
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

function startWSExchange(exchangeName, messageUpdatedCallback, globalState) {
  console.log(exchangeName)
  const wsConfig = EXCHANGES[exchangeName].adapterConfig;
  const wss = new WebSocket(wsConfig.wsURL);
  globalState[exchangeName] = {};
  wss.onopen = () => {
    activeChannels[exchangeName] = {};
    globalHeartbeats[exchangeName] = {};
    PAIRS.forEach(pair => {
      const pairName = wsConfig.pairNameMapping(pair);
      wss.send(JSON.stringify({
        event: wsConfig.eventName,
        channel: wsConfig.channelName,
        pair: pairName
      }));
    });
  }

  wss.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if(data.event && data.event === 'info') {
      console.log();
      console.log(`${exchangeName} info event`);
      return;
    }
    if(data.event && data.event === 'subscribed') {
      console.log();
      console.log(`${exchangeName} subscribed to channel ${data.channel} for pair ${data.pair} with id ${data.chanId}`);
      const normalizedPair = InvertedPaircodes[exchangeName][data.pair];
      activeChannels[exchangeName][data.chanId] = normalizedPair;
      globalState[exchangeName][normalizedPair] = {};
      const cycles = findCycles(cycleLength);
      setCycles(cycles);
      return;
    }
    if (data[1] === 'hb') {
      // console.log(`${exchangeName} heartbeat on channel ${data[0]} for pair ${activeChannels[exchangeName][data[0]]}`);
      globalHeartbeats[exchangeName][activeChannels[exchangeName][data[0]]] = Date.now();
      return;
    }
    const channel = data[0];
    const pair = activeChannels[exchangeName][channel];
    const pairState = globalState[exchangeName][pair];
    if(pairState) {
      updateCy(pair, exchangeName, data);
      pairState.bidPrice = data[1];
      pairState.bidSize = data[2];
      pairState.askPrice = data[3];
      pairState.askSize = data[4];
      globalHeartbeats[exchangeName][pair] = Date.now();
      messageUpdatedCallback(pair, globalState);
    }
  };
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

function startPusherExchange(exchangeName, messageUpdatedCallback, globalState) {
  const wsConfig = EXCHANGES[exchangeName].adapterConfig;
  const socket = new Pusher(wsConfig.pusherAppKey, {
  });
  globalState[exchangeName] = {};
  globalHeartbeats[exchangeName] = {};

  PAIRS.forEach(pair => {
    const channelName = wsConfig.channelNameMapping(pair);
    if(!channelName) {
      return;
    }
    const channel = socket.subscribe(channelName);
    globalState[exchangeName][pair] = {};

    channel.bind(wsConfig.eventName, data => {
      globalState[exchangeName][pair].bidPrice = data.bids[0][0];
      globalState[exchangeName][pair].bidSize = data.bids[0][1];
      globalState[exchangeName][pair].askPrice = data.asks[0][0];
      globalState[exchangeName][pair].askSize = data.asks[0][1];
      globalHeartbeats[exchangeName][pair] = Date.now();
      // const cycles = findCycles(cycleLength);
      // setCycles(cycles);
      messageUpdatedCallback(pair, globalState);
    });
  });
}

module.exports = (globalState, globalPairs) => {
  activeExchanges.forEach(exchangeKey => {
    const exchange = EXCHANGES[exchangeKey];
    const adapter = adapters[exchange.adapter];
    adapter(exchange.name, calcBoth, globalState, globalPairs);
  });
}
