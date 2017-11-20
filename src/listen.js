import _ from 'lodash';

import { createEdgesForPair } from 'helpers';
import adapters from 'adapters';

function updateEdges(pair, exchangeName, data) {
    const updates = createEdgesForPair(pair, exchangeName, data);
    window.testUpdates && window.testUpdates(updates);
}

export default exchanges => {
  exchanges.forEach(exchange => {
    const adapter = adapters[exchange.adapter];
    adapter(exchange, updateEdges);
  });
};
