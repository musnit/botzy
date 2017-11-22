import EXCHANGES from 'config/exchanges';
import PAIRS from 'config/pairs';

import PAIRCODES, { INVERTED_PAIRCODES } from 'config/paircodes';
import WebSocket from 'lib/web-socket';

export default function start(exchange, updateEdges) {
  const wsConfig = exchange.adapterConfig;
  const wss = new WebSocket(wsConfig.wsURL);
  const activeChannels = {};

  wss.onopen = () => {
    PAIRS.forEach(pair => {
      const pairName = wsConfig.pairNameMapping(pair);
      if (pairName) {
        wss.send(JSON.stringify({
          event: wsConfig.eventName,
          channel: wsConfig.channelName,
          pair: pairName
        }));
      }
    });
  }

  wss.onmessage = (msg) => {
    const data = JSON.parse(msg.data);
    if(data.event && data.event === 'error') {
      console.log(`Error: ${JSON.stringify(data)}`);
      return;
    }
    if(data.event && data.event === 'info') {
      console.log();
      console.log(`${exchange.name} info event`);
      return;
    }
    if(data.event && data.event === 'subscribed') {
      console.log();
      // console.log(`${exchange.name} subscribed to channel ${data.channel} for pair ${data.pair} with id ${data.chanId}`);
      const normalizedPair = INVERTED_PAIRCODES[exchange.name][data.pair];
      activeChannels[data.chanId] = normalizedPair;
      return;
    }
    if (data[1] === 'hb') {
      const channel = data[0];
      const pair = activeChannels[channel];
      const pairData = {
        heartbeat: Date.now(),
        heartbeatOnly: true,
      };
      updateEdges(pair, exchange.name, pairData);
      return;
    }
    const channel = data[0];
    const pair = activeChannels[channel];
    const pairData = {
      bidPrice: data[1],
      bidSize: data[2],
      askPrice: data[3],
      askSize: data[4],
      heartbeat: Date.now(),
      volume: data[8]
    };
    updateEdges(pair, exchange.name, pairData);
    return;
  };
};
