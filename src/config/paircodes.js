import _ from 'lodash';

const PAIRCODES = {
  bitfinex: {
    "btcusd": "BTCUSD",
    "ltcusd": "LTCUSD",
    "ltcbtc": "LTCBTC",
    "ethusd": "ETHUSD",
    "ethbtc": "ETHBTC",
    "etcbtc": "ETCBTC",
    "etcusd": "ETCUSD",
    "rrtusd": "RRTUSD",
    "rrtbtc": "RRTBTC",
    "zecusd": "ZECUSD",
    "zecbtc": "ZECBTC",
    "xmrusd": "XMRUSD",
    "xmrbtc": "XMRBTC",
    "dshusd": "DSHUSD",
    "dshbtc": "DSHBTC",
    "bccbtc": "BCCBTC",
    "bcubtc": "BCUBTC",
    "bccusd": "BCCUSD",
    "bcuusd": "BCUUSD",
    "xrpusd": "XRPUSD",
    "xrpbtc": "XRPBTC",
    "iotusd": "IOTUSD",
    "iotbtc": "IOTBTC",
    "ioteth": "IOTETH",
    "eosusd": "EOSUSD",
    "eosbtc": "EOSBTC",
    "eoseth": "EOSETH",
    "sanusd": "SANUSD",
    "sanbtc": "SANBTC",
    "saneth": "SANETH",
    "omgusd": "OMGUSD",
    "omgbtc": "OMGBTC",
    "omgeth": "OMGETH",
    "bchusd": "BCHUSD",
    "bchbtc": "BCHBTC",
    "bcheth": "BCHETH",
    "neousd": "NEOUSD",
    "neobtc": "NEOBTC",
    "neoeth": "NEOETH",
    "etpusd": "ETPUSD",
    "etpbtc": "ETPBTC",
    "etpeth": "ETPETH",
    "qtmusd": "QTMUSD",
    "qtmbtc": "QTMBTC",
    "qtmeth": "QTMETH",
    "bt1usd": "BT1USD",
    "bt2usd": "BT2USD",
    "bt1btc": "BT1BTC",
    "bt2btc": "BT2BTC",
    "avtusd": "AVTUSD",
    "avtbtc": "AVTBTC",
    "avteth": "AVTETH",
    "edousd": "EDOUSD",
    "edobtc": "EDOBTC",
    "edoeth": "EDOETH",
    "btgusd": "BTGUSD",
    "btgbtc": "BTGBTC",
    "datusd": "DATUSD",
    "datbtc": "DATBTC",
    "dateth": "DATETH",
    "btceur": "BTCEUR"
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
  }
};

export default PAIRCODES;

export const INVERTED_PAIRCODES = _.mapValues(PAIRCODES, codes => _.invert(codes));
