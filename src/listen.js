import helpers from './helpers';

const Pusher = require('pusher-js');
// const WebSocket = require('ws');
const _ = require('lodash');

const Paircodes = require('./config/paircodes');
const PAIRS = require('./config/pairs');

const InvertedPaircodes = _.mapValues(Paircodes, codes => _.invert(codes));

const Fees = require('./config/fees');

const exchanges = [
  {
    name: 'bitfinex',
    adapter: startWSExchange
  },
  {
    name: 'bitstamp',
    adapter: startPusherExchange
  }
];

const wsConfig = {
  bitfinex: {
    wsURL: 'wss://api.bitfinex.com/ws/',
    channelName: 'ticker',
    eventName: 'subscribe',
    pairName: pair => Paircodes.bitfinex[pair]
  },
  bitstamp: {
    pusherAppKey: 'de504dc5763aeef9ff52',
    eventName: 'data',
    channelName: pair => `order_book${Paircodes.bitstamp[pair]}`
  }
}

const activeChannels = {};

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
    result[1].weight = buy2Sell1/stateTwo.askPrice*100
  }
  return result;
}

function calcBoth(pair, globalState) {
  const statesForPair = exchanges.map(exchange => {
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

function updatePairGlobal(pair, pairResults) {
  window.globalPairs[pair] = pairResults;
  window.hackRerender && window.hackRerender(window.globalPairs);
  const graph = helpers.createPairGraph(globalState);
  const cycleLength = 3;
  const cycles = helpers.makeCycles(graph, cycleLength);
  const cycleResults = helpers.walkCycles(cycles, cycleLength);
  const finalCycleResults = helpers.filterDupCycles(cycleResults, cycleLength);
  window.hackRerender2 && window.hackRerender2(finalCycleResults);
}

function startWSExchange(exchangeName, messageUpdatedCallback, globalState) {
  const wss = new WebSocket(wsConfig[exchangeName].wsURL);
  globalState[exchangeName] = {};
  wss.onopen = () => {
    activeChannels[exchangeName] = {};
    PAIRS.forEach(pair => {
      wss.send(JSON.stringify({
        event: wsConfig[exchangeName].eventName,
        channel: wsConfig[exchangeName].channelName,
        pair: wsConfig[exchangeName].pairName(pair)
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
      return;
    }
    if (data[1] === 'hb') {
      // console.log(`${exchangeName} heartbeat`);
      // console.log();
      return;
    }
    const channel = data[0];
    const pair = activeChannels[exchangeName][channel];
    globalState[exchangeName][pair].bidPrice = data[1];
    globalState[exchangeName][pair].bidSize = data[2];
    globalState[exchangeName][pair].askPrice = data[3];
    globalState[exchangeName][pair].askSize = data[4];
    messageUpdatedCallback(pair, globalState);
  };
}

function startPusherExchange(exchangeName, messageUpdatedCallback, globalState) {
  const socket = new Pusher(wsConfig[exchangeName].pusherAppKey, {
  });
  globalState[exchangeName] = {};

  PAIRS.forEach(pair => {
    const channel = socket.subscribe(wsConfig[exchangeName].channelName(pair));
    globalState[exchangeName][pair] = {};

    channel.bind(wsConfig[exchangeName].eventName, data => {
      globalState[exchangeName][pair].bidPrice = data.bids[0][0];
      globalState[exchangeName][pair].bidSize = data.bids[0][1];
      globalState[exchangeName][pair].askPrice = data.asks[0][0];
      globalState[exchangeName][pair].askSize = data.asks[0][1];
      messageUpdatedCallback(pair, globalState);
    });
  });
}

module.exports = (globalState, globalPairs) => {
  console.log('Starting');
  exchanges.forEach(exchange => {
    exchange.adapter(exchange.name, calcBoth, globalState, globalPairs);
  });
}
