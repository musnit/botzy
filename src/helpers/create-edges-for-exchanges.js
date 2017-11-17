import PAIRS from 'config/pairs';

export const createEdgesForExchanges = exchanges => {
  const edges = exchanges.reduce((accum, exchange) => {
    const edges = createEdgesForExchange(exchange);
    accum = accum.concat(edges);
    return accum;
  }, []);
  return edges;
};

export const createEdgesForPair = (pair, exchangeName, data = {}) => {
  const currency1 = pair.slice(0, 3);
  const currency2 = pair.slice(3);
  const edges = [
    {
      data: {
        id: `${exchangeName}_${currency1}_${currency2}_m`,
        source: currency1,
        target: currency2,
        maker: true,
        exchange: exchangeName,
        weight: data.askPrice,
        depth: data.askSize,
        heartbeat: data.heartbeat,
        volume: data.volume
      },
    },
    {
      data: {
        id: `${exchangeName}_${currency1}_${currency2}_t`,
        source: currency1,
        target: currency2,
        maker: false,
        exchange: exchangeName,
        weight: data.bidPrice,
        depth: data.bidSize,
        heartbeat: data.heartbeat,
        volume: data.volume
      },
    },
    {
      data: {
        id: `${exchangeName}_${currency2}_${currency1}_m`,
        source: currency2,
        target: currency1,
        maker: true,
        exchange: exchangeName,
        weight: 1/data.bidPrice,
        depth: data.bidSize,
        heartbeat: data.heartbeat,
        volume: data.volume
      }
    },
    {
      data: {
        id: `${exchangeName}_${currency2}_${currency1}_t`,
        source: currency2,
        target: currency1,
        maker: false,
        exchange: exchangeName,
        weight: 1/data.askPrice,
        depth: data.askSize,
        heartbeat: data.heartbeat,
        volume: data.volume
      }
    }
  ];
  return edges;
};

const createEdgesForExchange = exchange => {
  const pairNameMapping = exchange.adapterConfig.pairNameMapping;
  return PAIRS.reduce((accum, pair) => {
    const pairName = pairNameMapping(pair);
    if (pairName) {
      const edges = createEdgesForPair(pair, exchange.name);
      accum = accum.concat(edges);
    }
    return accum;
  }, []);
};
