import _ from 'lodash';

const symbols = [
  {
    pair: "btcusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.004",
    expiration: "NA"
  },
  {
    pair: "ltcusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.2",
    expiration: "NA"
  },
  {
    pair: "ltcbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.2",
    expiration: "NA"
  },
  {
    pair: "ethusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.04",
    expiration: "NA"
  },
  {
    pair: "ethbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.04",
    expiration: "NA"
  },
  {
    pair: "etcbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "1.0",
    expiration: "NA"
  },
  {
    pair: "etcusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "1.0",
    expiration: "NA"
  },
  {
    pair: "rrtusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "98.0",
    expiration: "NA"
  },
  {
    pair: "rrtbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "98.0",
    expiration: "NA"
  },
  {
    pair: "zecusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "20000.0",
    minimum_order_size: "0.04",
    expiration: "NA"
  },
  {
    pair: "zecbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "20000.0",
    minimum_order_size: "0.04",
    expiration: "NA"
  },
  {
    pair: "xmrusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.2",
    expiration: "NA"
  },
  {
    pair: "xmrbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.2",
    expiration: "NA"
  },
  {
    pair: "dshusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.04",
    expiration: "NA"
  },
  {
    pair: "dshbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "5000.0",
    minimum_order_size: "0.04",
    expiration: "NA"
  },
  {
    pair: "bccbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.004",
    expiration: "NA"
  },
  {
    pair: "bcubtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.08",
    expiration: "NA"
  },
  {
    pair: "bccusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.004",
    expiration: "NA"
  },
  {
    pair: "bcuusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.08",
    expiration: "NA"
  },
  {
    pair: "btceur",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.004",
    expiration: "NA"
  },
  {
    pair: "xrpusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "200000.0",
    minimum_order_size: "52.0",
    expiration: "NA"
  },
  {
    pair: "xrpbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "200000.0",
    minimum_order_size: "52.0",
    expiration: "NA"
  },
  {
    pair: "iotusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "28.0",
    expiration: "NA"
  },
  {
    pair: "iotbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "28.0",
    expiration: "NA"
  },
  {
    pair: "ioteth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "28.0",
    expiration: "NA"
  },
  {
    pair: "eosusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "50000.0",
    minimum_order_size: "14.0",
    expiration: "NA"
  },
  {
    pair: "eosbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "50000.0",
    minimum_order_size: "14.0",
    expiration: "NA"
  },
  {
    pair: "eoseth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "50000.0",
    minimum_order_size: "14.0",
    expiration: "NA"
  },
  {
    pair: "sanusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "200000.0",
    minimum_order_size: "40.0",
    expiration: "NA"
  },
  {
    pair: "sanbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "200000.0",
    minimum_order_size: "40.0",
    expiration: "NA"
  },
  {
    pair: "saneth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "200000.0",
    minimum_order_size: "40.0",
    expiration: "NA"
  },
  {
    pair: "omgusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "2.0",
    expiration: "NA"
  },
  {
    pair: "omgbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "2.0",
    expiration: "NA"
  },
  {
    pair: "omgeth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "2.0",
    expiration: "NA"
  },
  {
    pair: "bchusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.02",
    expiration: "NA"
  },
  {
    pair: "bchbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.02",
    expiration: "NA"
  },
  {
    pair: "bcheth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.02",
    expiration: "NA"
  },
  {
    pair: "neousd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "10000.0",
    minimum_order_size: "0.4",
    expiration: "NA"
  },
  {
    pair: "neobtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "10000.0",
    minimum_order_size: "0.4",
    expiration: "NA"
  },
  {
    pair: "neoeth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "10000.0",
    minimum_order_size: "0.4",
    expiration: "NA"
  },
  {
    pair: "etpusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "10000.0",
    minimum_order_size: "4.0",
    expiration: "NA"
  },
  {
    pair: "etpbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "10000.0",
    minimum_order_size: "4.0",
    expiration: "NA"
  },
  {
    pair: "etpeth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "10000.0",
    minimum_order_size: "4.0",
    expiration: "NA"
  },
  {
    pair: "qtmusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "2.0",
    expiration: "NA"
  },
  {
    pair: "qtmbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "2.0",
    expiration: "NA"
  },
  {
    pair: "qtmeth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "2.0",
    expiration: "NA"
  },
  {
    pair: "bt1usd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.002",
    expiration: "NA"
  },
  {
    pair: "bt2usd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.2",
    expiration: "NA"
  },
  {
    pair: "bt1btc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.002",
    expiration: "NA"
  },
  {
    pair: "bt2btc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.2",
    expiration: "NA"
  },
  {
    pair: "avtusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "6.0",
    expiration: "NA"
  },
  {
    pair: "avtbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "6.0",
    expiration: "NA"
  },
  {
    pair: "avteth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "6.0",
    expiration: "NA"
  },
  {
    pair: "edousd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "50000.0",
    minimum_order_size: "6.0",
    expiration: "NA"
  },
  {
    pair: "edobtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "50000.0",
    minimum_order_size: "6.0",
    expiration: "NA"
  },
  {
    pair: "edoeth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "50000.0",
    minimum_order_size: "6.0",
    expiration: "NA"
  },
  {
    pair: "btgusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.06",
    expiration: "NA"
  },
  {
    pair: "btgbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "2000.0",
    minimum_order_size: "0.06",
    expiration: "NA"
  },
  {
    pair: "datusd",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "158.0",
    expiration: "NA"
  },
  {
    pair: "datbtc",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "158.0",
    expiration: "NA"
  },
  {
    pair: "dateth",
    price_precision: 5,
    initial_margin: "30.0",
    minimum_margin: "15.0",
    maximum_order_size: "100000.0",
    minimum_order_size: "158.0",
    expiration: "NA"
  }
];

export default _.keyBy(symbols, 'pair');
