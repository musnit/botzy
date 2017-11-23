import request from 'superagent';
import crypto from 'crypto';

import secrets from '../secrets/bitfinex';

const baseUrl = 'https://api.bitfinex.com';

const URLS = {
  'account_infos': '/v1/account_infos',
  'new_order': '/v1/order/new',
  'cancel_order': '/v1/order/cancel',
  'replace_order': '/v1/order/cancel/replace',
};

const nonce = Date.now().toString();

export default (type, body) => {
  const completeURL = baseUrl + URLS[type];
  const payload = new Buffer(JSON.stringify(body))
    .toString('base64');

  const signature = crypto
    .createHmac('sha384', secrets.apiSecret)
    .update(payload)
    .digest('hex');

  const headers = {
    'X-BFX-APIKEY': secrets.apiKey,
    'X-BFX-PAYLOAD': payload,
    'X-BFX-SIGNATURE': signature
  };

  return request
    .post(completeURL)
    .set(headers)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(body));
};
