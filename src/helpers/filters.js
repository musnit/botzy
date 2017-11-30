import TOP_CURRENCIES from 'config/top';
import FIAT from 'config/fiat';

export const allHighVolume = cycle => _.every(cycle.path, edge => {
  return edge.data('volume')? edge.data('volume') > 8000 : true;
});

export const allTaker = cycle => _.every(cycle.path, edge => {
  return edge.data('maker') === false;
});

export const oneMaker = cycle => _.filter(cycle.path, edge => {
  return edge.data('maker') === true;
}).length === 1;

export const someUSD = cycle => _.some(cycle.path, edge => {
  return edge.data('source') === 'usd' || edge.data('target') === 'usd';
});

export const someBitstamp = cycle => _.some(cycle.path, edge => {
  return edge.data('exchange') === 'bitstamp';
});

export const someBitfinex = cycle =>  _.some(cycle.path, edge => {
  return edge.data('exchange') === 'bitfinex';
});

export const someLuno = cycle =>  _.some(cycle.path, edge => {
  return edge.data('exchange') === 'luno';
});

export const allBitfinex = cycle =>  _.every(cycle.path, edge => {
  return edge.data('exchange') === 'bitfinex';
});

export const allTopCurrencies = cycle =>  _.every(cycle.path, edge => {
  return TOP_CURRENCIES.includes(edge.data('source'));
});

export const fiatBoughtOnBitstamp = cycle =>  _.some(cycle.path, edge => {
  return FIAT.includes(edge.data('target')) && edge.data('exchange') === 'bitstamp';
});

export const fiatSoldOnBitstamp = cycle =>  _.some(cycle.path, edge => {
  return FIAT.includes(edge.data('source')) && edge.data('exchange') === 'bitstamp';
});

export const fiatSoldOnBitfinex = cycle =>  _.some(cycle.path, edge => {
  return FIAT.includes(edge.data('source')) && edge.data('exchange') === 'bitfinex';
});

export const allFiatEdges = cycle =>  _.every(cycle.path, edge => {
  return FIAT.includes(edge.data('source')) || FIAT.includes(edge.data('target'));
});

export const makeFromBTCETH = cycle =>  _.some(cycle.path, edge => {
  return ['btc', 'eth'].includes(edge.data('source')) && edge.data('maker') === true;
});

export const makeFromBTC = cycle =>  _.some(cycle.path, edge => {
  return ['btc'].includes(edge.data('source')) && edge.data('maker') === true;
});

export const containsEdge = edge => cycle =>  _.some(cycle.path, cycleEdge => {
  return cycleEdge.data('id') === edge.id;
});
//no dollar transfers across exchanges...

//dollar transfers ok as long as no imbalance in holdings on exchanges between fiat/crypto

export const twoWay = cycle => cycle.path.length === 2;
export const fourWay = cycle => cycle.path.length === 4;

export const includeCurrencies = currencies => cycle =>  _.some(cycle.path, edge => {
  return currencies.split(',').includes(edge.data('source'));
});

export const excludeCurrencies = currencies => cycle =>  _.every(cycle.path, edge => {
  return !currencies.split(',').includes(edge.data('source'));
});

//broken:
// const onlyCurrencies = currencies => cycle =>  _.every(cycle.path, edge => {
//   return _.some(currencies.split(','), currency => {
//     console.log(edge.data('source') === currency);
//     edge.data('source') === currency;
//   });
// });

export default {
  allHighVolume: { text: 'All must be high volume', filter: allHighVolume },
  allTaker: { text: 'All must be takers', filter: allTaker },
  oneMaker: { text: 'Must have exactly 1 maker', filter: oneMaker },
  someUSD: { text: 'Must have some USD edge', filter: someUSD },
  someBitstamp: { text: 'Must have some Bitstamp edge', filter: someBitstamp },
  someBitfinex: { text: 'Must have some Bitfinex edge' , filter: someBitfinex },
  someLuno: { text: 'Must have some Luno edge' , filter: someLuno },
  allBitfinex: { text: 'Must have all Bitfinex edges' , filter: allBitfinex },
  allTopCurrencies: { text: 'Must be all top currencies' , filter: allTopCurrencies },
  fiatBoughtOnBitstamp: { text: 'Must be a trade that buys fiat on bitstamp' , filter: fiatBoughtOnBitstamp },
  fiatSoldOnBitstamp: { text: 'Must be a trade that sells fiat on bitstamp' , filter: fiatSoldOnBitstamp },
  fiatSoldOnBitfinex: { text: 'Must be a trade that sells fiat on bitstamp' , filter: fiatSoldOnBitfinex },
  allFiatEdges: { text: 'All edges must trade fiat' , filter: allFiatEdges },
  twoWay: { text: 'Must be exactly 2-way trade' , filter: twoWay },
  fourWay: { text: 'Must be exactly 4-way trade' , filter: fourWay },
  includeCurrencies: { text: 'Must include currencies ->' , filter: includeCurrencies, params: true },
  excludeCurrencies: { text: 'Must exclude currencies ->' , filter: excludeCurrencies, params: true },
  makeFromBTCETH: { text: 'Must be maker on ETH or BTC sale' , filter: makeFromBTCETH },
  makeFromBTC: { text: 'Must be maker on BTC sale' , filter: makeFromBTC },
  // onlyCurrencies: { text: 'Must include only currencies ->' , filter: onlyCurrencies, params: true },
};
