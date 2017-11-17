import PAIRS from 'config/pairs';

const createEdgesForExchanges = exchanges => {
  const edges = exchanges.reduce((accum, exchange) => {
    const edges = createEdgesForExchange(exchange);
    accum = accum.concat(edges);
    return accum;
  }, []);
  return edges;
};

const createEdgesForPair = (pair, exchangeName) => {
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
      },
    }, {
      data: {
        id: `${exchangeName}_${currency1}_${currency2}_t`,
        source: currency1,
        target: currency2,
        maker: false,
        exchange: exchangeName,
      },
    }, {
      data: {
        id: `${exchangeName}_${currency2}_${currency1}_m`,
        source: currency2,
        target: currency1,
        maker: true,
        exchange: exchangeName,
      }
    }, {
      data: {
        id: `${exchangeName}_${currency2}_${currency1}_t`,
        source: currency2,
        target: currency1,
        maker: false,
        exchange: exchangeName,
  }}];
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

export default createEdgesForExchanges;
