import _ from 'lodash';

import { createEdgesForPair } from 'helpers';
import adapters from 'adapters';

function updateEdges(pair, exchangeName, data) {
    const updates = createEdgesForPair(pair, exchangeName, data);
    window.testUpdates && window.testUpdates(updates);
    window.checkTriggers && window.checkTriggers(updates);
    window.checkActives && window.checkActives(updates);
}

export default exchanges => {
  return Promise.all(exchanges.map(exchange => {
    const adapter = adapters[exchange.adapter];
    return adapter(exchange, updateEdges);
  }));
};
