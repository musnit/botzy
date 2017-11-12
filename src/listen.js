const Pusher = require('pusher-js');
const WebSocket = require('ws');
const _ = require('lodash');

const Paircodes = require('./config/paircodes');
const PAIRS = require('./config/pairs');

const InvertedPaircodes = _.mapValues(Paircodes, codes => _.invert(codes));

const Fees = require('./config/fees');


let state = {};

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
  console.log(`Comparing ${pairStateOne.exchange.name} and ${pairStateTwo.exchange.name}`);
  const stateOne =  pairStateOne.state;
  const stateTwo =  pairStateTwo.state;
  if(!stateOne) {
    console.log(`No pair data for ${pairStateOne.exchange.name}`);
    return;
  }
  if(!stateTwo) {
    console.log(`No pair data for ${pairStateTwo.exchange.name}`);
    return;
  }
  const feesOne = Fees[pairStateOne.exchange.name].fee;
  const feesTwo = Fees[pairStateTwo.exchange.name].fee;
  const buy1Sell2 = ((stateTwo.bidPrice * feesTwo) - stateOne.askPrice) * feesOne;
  const buy2Sell1 = ((stateOne.bidPrice * feesOne) - stateTwo.askPrice) * feesTwo;

  console.log(`Buy ${pairStateOne.exchange.name} sell ${pairStateTwo.exchange.name}: ${buy1Sell2/stateOne.askPrice*100}`);
  console.log(`Buy ${pairStateTwo.exchange.name} sell ${pairStateOne.exchange.name}: ${buy2Sell1/stateTwo.askPrice*100}`);
}

function calcBoth(pair) {
  console.log();
  console.log(`${pair}:`);
  const statesForPair = exchanges.map(exchange => {
    return {
      exchange,
      state: state[exchange.name][pair]
    };
  });
  for(let i = 0; i < statesForPair.length - 1; i++) {
    for(let j = i + 1; j < statesForPair.length; j++) {
      const pairStateOne = statesForPair[i];
      const pairStateTwo = statesForPair[j];
      compareForPair(pairStateOne, pairStateTwo);
    }
  }
}

function startWSExchange(exchangeName, messageUpdatedCallback) {
  const wss = new WebSocket(wsConfig[exchangeName].wsURL);
  state[exchangeName] = {};
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
      state[exchangeName][normalizedPair] = {};
      return;
    }
    if (data[1] === 'hb') {
      // console.log(`${exchangeName} heartbeat`);
      // console.log();
      return;
    }
    const channel = data[0];
    const pair = activeChannels[exchangeName][channel];
    state[exchangeName][pair].bidPrice = data[1];
    state[exchangeName][pair].bidSize = data[2];
    state[exchangeName][pair].askPrice = data[3];
    state[exchangeName][pair].askSize = data[4];
    messageUpdatedCallback(pair);
  };
}

function startPusherExchange(exchangeName, messageUpdatedCallback) {
  const socket = new Pusher(wsConfig[exchangeName].pusherAppKey, {
  });
  state[exchangeName] = {};

  PAIRS.forEach(pair => {
    const channel = socket.subscribe(wsConfig[exchangeName].channelName(pair));
    state[exchangeName][pair] = {};

    channel.bind(wsConfig[exchangeName].eventName, data => {
      state[exchangeName][pair].bidPrice = data.bids[0][0];
      state[exchangeName][pair].bidSize = data.bids[0][1];
      state[exchangeName][pair].askPrice = data.asks[0][0];
      state[exchangeName][pair].askSize = data.asks[0][1];
      messageUpdatedCallback(pair);
    });
  });
}

module.exports = _ => {
  console.log('Starting');
  exchanges.forEach(exchange => {
    exchange.adapter(exchange.name, calcBoth);
  });
}
