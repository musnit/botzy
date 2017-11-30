import _ from 'lodash';

const symbols = [
  {
    pair: "ETHXBT",
    maximum_order_size: "2",
    minimum_order_size: "0.01"
  }
];

export default _.keyBy(symbols, 'pair');
