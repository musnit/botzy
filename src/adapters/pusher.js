import Pusher from 'pusher-js';

import EXCHANGES from 'config/exchanges';
import PAIRS from 'config/pairs';

export default function start(exchange, updateEdges) {
  const wsConfig = exchange.adapterConfig;
  const socket = new Pusher(wsConfig.pusherAppKey, {
  });

  PAIRS.forEach(pair => {
    const channelName = wsConfig.pairNameMapping(pair);
    if(!channelName) {
      return;
    }
    const channel = socket.subscribe(channelName);

    channel.bind(wsConfig.eventName, data => {
      const pairData = {
        bidPrice: data.bids[0][0],
        bidSize: data.bids[0][1],
        askPrice: data.asks[0][0],
        askSize: data.asks[0][1],
        heartbeat: Date.now(),
      }
      updateEdges(pair, exchange.name, pairData);
      return;
    });
  });
};
