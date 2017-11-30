import request from 'superagent';
import crypto from 'crypto';

import secrets from '../../secrets/luno';

const baseUrl = 'https://api.mybitx.com/api/1/';

const ACTIONS = {
  'new_limit_order': {
    transformRequest: payload => ({
      pair: payload.symbol,
      type: payload.side === 'buy'? 'BID' : 'ASK',
      volume: payload.amount,
      price: payload.price
    }),
    transformResponse: payload => ({
      id: payload.order_id
    }),
    url: 'postorder'
  },
  'cancel_order': {
    transformRequest: payload => ({
      order_id: payload.id,
    }),
    transformResponse: payload => payload,
    url: 'stoporder'
  }
};

const makeRequest = (action, payload) => {
  const completeURL = baseUrl + action.url;

  return request
    .post(completeURL)
    .auth(secrets.trading_api_key_id, secrets.trading_api_key_secret)
    .type('form')
    .send(payload).then(response => {
      if (response instanceof Error) {
        return Promise.reject({ response: response.response });
      }
      if(response.body.error) {
        return Promise.reject({ response });
      };
      const payload = response.body;
      return action.transformResponse(payload);
    }, error => {
      return Promise.reject(error);
    });
};

export default (actionKey, payload) => {
  const action = ACTIONS[actionKey];
  const transformedPayload = action.transformRequest(payload);
  return makeRequest(action, transformedPayload);
}
