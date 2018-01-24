import _ from 'lodash';

const PAIRCODES = {
  bitfinex: {
    'btcusd': 'BTCUSD',
    'ltcusd': 'LTCUSD',
    'ltcbtc': 'LTCBTC',
    'ethusd': 'ETHUSD',
    'ethbtc': 'ETHBTC',
    'etcbtc': 'ETCBTC',
    'etcusd': 'ETCUSD',
    'rrtusd': 'RRTUSD',
    'rrtbtc': 'RRTBTC',
    'zecusd': 'ZECUSD',
    'zecbtc': 'ZECBTC',
    'xmrusd': 'XMRUSD',
    'xmrbtc': 'XMRBTC',
    'dshusd': 'DSHUSD',
    'dshbtc': 'DSHBTC',
    'xrpusd': 'XRPUSD',
    'xrpbtc': 'XRPBTC',
    'iotusd': 'IOTUSD',
    'iotbtc': 'IOTBTC',
    'ioteth': 'IOTETH',
    'eosusd': 'EOSUSD',
    'eosbtc': 'EOSBTC',
    'eoseth': 'EOSETH',
    'sanusd': 'SANUSD',
    'sanbtc': 'SANBTC',
    'saneth': 'SANETH',
    'omgusd': 'OMGUSD',
    'omgbtc': 'OMGBTC',
    'omgeth': 'OMGETH',
    'bchusd': 'BCHUSD',
    'bchbtc': 'BCHBTC',
    'bcheth': 'BCHETH',
    'neousd': 'NEOUSD',
    'neobtc': 'NEOBTC',
    'neoeth': 'NEOETH',
    'etpusd': 'ETPUSD',
    'etpbtc': 'ETPBTC',
    'etpeth': 'ETPETH',
    'qtmusd': 'QTMUSD',
    'qtmbtc': 'QTMBTC',
    'qtmeth': 'QTMETH',
    'avtusd': 'AVTUSD',
    'avtbtc': 'AVTBTC',
    'avteth': 'AVTETH',
    'edousd': 'EDOUSD',
    'edobtc': 'EDOBTC',
    'edoeth': 'EDOETH',
    'btgusd': 'BTGUSD',
    'btgbtc': 'BTGBTC',
    'datusd': 'DATUSD',
    'datbtc': 'DATBTC',
    'dateth': 'DATETH',
    'btceur': 'BTCEUR'
  },
  bitstamp: {
    btcusd: 'order_book',
    btceur: 'order_book_btceur',
    ltcusd: 'order_book_ltcusd',
    ethusd: 'order_book_ethusd',
    xrpusd: 'order_book_xrpusd',
    eurusd: 'order_book_eurusd',
    xrpbtc: 'order_book_xrpbtc',
    ethbtc: 'order_book_ethbtc',
    ltcbtc: 'order_book_ltcbtc',
    xrpeur: 'order_book_xrpeur',
    etheur: 'order_book_etheur',
    ltceur: 'order_book_ltceur',
  },
  luno: {
    ethbtc: 'ETHXBT',
  },
  bibox: {
    'bixbtc': 'BIX_BTC',
    'bixeth': 'BIX_ETH',
    'gtcbtc': 'GTC_BTC',
    'gtceth': 'GTC_ETH',
    'ethbtc': 'ETH_BTC',
    'ltcbtc': 'LTC_BTC',
    'bchbtc': 'BCH_BTC',
    'etcbtc': 'ETC_BTC',
    'etceth': 'ETC_ETH',
    'bcheth': 'BCH_ETH',
    'ltceth': 'LTC_ETH',
    'tnbbtc': 'TNB_BTC',
    'tnbeth': 'TNB_ETH',
    'eosbtc': 'EOS_BTC',
    'eoseth': 'EOS_ETH',
    'cmtbtc': 'CMT_BTC',
    'cmteth': 'CMT_ETH',
    'btmbtc': 'BTM_BTC',
    'btmeth': 'BTM_ETH',
    'prabtc': 'PRA_BTC',
    'praeth': 'PRA_ETH',
    // 'lendbtc': 'LEND_BTC',
    // 'lendeth': 'LEND_ETH',
    'rdnbtc': 'RDN_BTC',
    'rdneth': 'RDN_ETH',
    'manabtc': 'MANA_BTC',
    'manaeth': 'MANA_ETH',
    'hpbbtc': 'HPB_BTC',
    'hpbeth': 'HPB_ETH',
    // 'sbtcbtc': 'SBTC_BTC',
    // 'sbtceth': 'SBTC_ETH',
    // 'btcusdt': 'BTC_USDT',
    // 'ethusdt': 'ETH_USDT',
    'elfbtc': 'ELF_BTC',
    'elfeth': 'ELF_ETH',
    // 'ltcusdt': 'LTC_USDT',
    // 'eosusdt': 'EOS_USDT',
    'mkrbtc': 'MKR_BTC',
    'mkreth': 'MKR_ETH',
    'ethdai': 'ETH_DAI',
    'itcbtc': 'ITC_BTC',
    'itceth': 'ITC_ETH',
    'motbtc': 'MOT_BTC',
    'moteth': 'MOT_ETH',
    'gnxbtc': 'GNX_BTC',
    'gnxeth': 'GNX_ETH',
    'catbtc': 'CAT_BTC',
    'cateth': 'CAT_ETH',
    'cagbtc': 'CAG_BTC',
    'cageth': 'CAG_ETH',
    // 'showbtc': 'SHOW_BTC',
    // 'showeth': 'SHOW_ETH',
    // 'aidocbtc': 'AIDOC_BTC',
    // 'aidoceth': 'AIDOC_ETH',
    'awrbtc': 'AWR_BTC',
    'awreth': 'AWR_ETH',
    'btobtc': 'BTO_BTC',
    'btoeth': 'BTO_ETH',
    'ammbtc': 'AMM_BTC',
    'ammeth': 'AMM_ETH'
  }
};

export default PAIRCODES;

export const INVERTED_PAIRCODES = _.mapValues(PAIRCODES, codes => _.invert(codes));
