import EXCHANGES from '../config/exchanges';
import PAIRS from '../config/pairs';

import WebSocket from '../lib/web-socket';

export default function startWSExchange(exchangeName, messageUpdatedCallback, globalState) {
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
      // const cycles = findCycles(cycleLength);
      // setCycles(cycles);
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
      return;
    }
  };
}
