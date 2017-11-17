import Pusher from 'pusher-js';

import EXCHANGES from 'config/exchanges';
import PAIRS from 'config/pairs';

export default function start(exchangeName, messageUpdatedCallback, globalState, activeChannels, globalHeartbeats, setCycles, updateCy) {
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
};
