import request from 'superagent';
import crypto from 'crypto';

import secrets from '../../secrets/bitfinex';

const baseUrl = 'https://api.bitfinex.com';

const ACTIONS = {
  'new_limit_order': {
    transformPayload: payload => ({
      symbol: payload.symbol,
      amount: payload.amount,
      price: payload.price,
      exchange: 'bitfinex',
      side: payload.side,
      type: 'exchange limit'
    }),
    url: '/v1/order/new'
  },
  'cancel_order': {
    transformPayload: payload => ({ order_id: payload.id }),
    url: '/v1/order/cancel'
  },
  'replace_limit_order': {
    transformPayload: payload => ({
      order_id: payload.id,
      symbol: payload.symbol,
      amount: payload.amount,
      price: payload.price,
      side: payload.side,
      type: payload.type
    }),
    url: '/v1/order/cancel/replace'
  },
};

const signPayload = payload => crypto
  .createHmac('sha384', secrets.apiSecret)
  .update(payload)
  .digest('hex');

const makeRequest = (action, payload) => {
  const completeURL = baseUrl + action.url;
  const stringPayload = JSON.stringify(payload);
  const base64Payload = new Buffer(stringPayload)
    .toString('base64');

  const signature = signPayload(base64Payload);

  const headers = {
    'X-BFX-APIKEY': secrets.apiKey,
    'X-BFX-PAYLOAD': base64Payload,
    'X-BFX-SIGNATURE': signature
  };

  return request
    .post(completeURL)
    .set(headers)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(stringPayload));
};

export default (actionKey, payload) => {
  const action = ACTIONS[actionKey];
  const transformedPayload = action.transformPayload(payload);
  const finalPayload = Object.assign({}, transformedPayload, {
    request: action.url,
    nonce: Date.now().toString()
  });
  return makeRequest(action, finalPayload);
}
