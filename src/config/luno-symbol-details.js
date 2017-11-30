import _ from 'lodash';

const symbols = [
  {
    pair: "ETHXBT",
    maximum_order_size: "2",
    minimum_order_size: "0.01",
    "minimum_price_increment": "0.0001"
  }
];

export default _.keyBy(symbols, 'pair');
