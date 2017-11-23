import request from 'superagent';

const baseUrl = 'http://localhost:8080/message';

export default (type, body) => {
  return request
    .post(baseUrl)
    .set('Content-Type', 'application/json')
    .send(JSON.stringify({ type, body }));
};
