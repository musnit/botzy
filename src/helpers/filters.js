import TOP_CURRENCIES from 'config/top';
import FIAT from 'config/fiat';

const allHighVolume = cycle => _.every(cycle.path, edge => {
  return edge.data('volume')? edge.data('volume') > 8000 : true;
});

const allTaker = cycle => _.every(cycle.path, edge => {
  return edge.data('maker') === false;
});

const oneMaker = cycle => _.filter(cycle.path, edge => {
  return edge.data('maker') === true;
}).length === 1;

const someUSD = cycle => _.some(cycle.path, edge => {
  return edge.data('source') === 'usd' || edge.data('target') === 'usd';
});

const someBitstamp = cycle => _.some(cycle.path, edge => {
  return edge.data('exchange') === 'bitstamp';
});

const someBitfinex = cycle =>  _.some(cycle.path, edge => {
  return edge.data('exchange') === 'bitfinex';
});

const allBitfinex = cycle =>  _.every(cycle.path, edge => {
  return edge.data('exchange') === 'bitfinex';
});

const allTopCurrencies = cycle =>  _.every(cycle.path, edge => {
  return TOP_CURRENCIES.includes(edge.data('source'));
});

const fiatBoughtOnBitstamp = cycle =>  _.some(cycle.path, edge => {
  return FIAT.includes(edge.data('target')) && edge.data('exchange') === 'bitstamp';
});

const fiatSoldOnBitstamp = cycle =>  _.some(cycle.path, edge => {
  return FIAT.includes(edge.data('source')) && edge.data('exchange') === 'bitstamp';
});

const twoWay = cycle => cycle.path.length === 2;

export default {
  allHighVolume: { text: 'All must be high volume', filter: allHighVolume },
  allTaker: { text: 'All must be takers', filter: allTaker },
  oneMaker: { text: 'Must have exactly 1 maker', filter: oneMaker },
  someUSD: { text: 'Must have some USD edge', filter: someUSD },
  someBitstamp: { text: 'Must have some Bitstamp edge', filter: someBitstamp },
  someBitfinex: { text: 'Must have some Bitfinex edge' , filter: someBitfinex },
  allBitfinex: { text: 'Must have all Bitfinex edges' , filter: allBitfinex },
  allTopCurrencies: { text: 'Must be all top currencies' , filter: allTopCurrencies },
  fiatBoughtOnBitstamp: { text: 'Must be a trade that buys fiat on bitstamp' , filter: fiatBoughtOnBitstamp },
  fiatSoldOnBitstamp: { text: 'Must be a trade that sells fiat on bitstamp' , filter: fiatSoldOnBitstamp },
  twoWay: { text: 'Must be exactly 2-way trade' , filter: twoWay },
};
