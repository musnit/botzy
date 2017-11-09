const google = require('googleapis');
const _ = require('lodash');
const request = require('superagent');
const sheets = google.sheets('v4');

const stubs = require('./stubs');

const spreadsheetId = '1Y0F21eNe8fV9ekfNSa-TY1O0t41s8pqJez7G3ov3YdI';
const bitstampCurrencyCells = 'bitstamp script testing!A2:A13';
const bitstampCurrencyValueCells = 'bitstamp script testing!B2:B13';

const bitstampURL = 'https://www.bitstamp.net/api/v2/ticker/';
const baseURL = bitstampURL;

const getSheetValues = params => new Promise((resolve, reject) => {
  sheets.spreadsheets.values.get(params, (err, response) => {
      if(err) {
        reject(err);
      }
      else {
        resolve(response);
      }
  });
});

const setSheetValues = params => new Promise((resolve, reject) => {
  sheets.spreadsheets.values.update(params, (err, response) => {
    if(err) {
      reject(err);
    } else {
      resolve(response);
    }
  });
});

function createPairGraph(tickerCalls) {
  return tickerCalls.reduce((accum, call) => {
    const currency1 = call.pair.slice(0,3);
    const currency2 = call.pair.slice(3);
    accum[currency1] = accum[currency1] || {};
    accum[currency2] = accum[currency2] || {};
    accum[currency1].pairs = accum[currency1].pairs || {};
    accum[currency2].pairs = accum[currency2].pairs || {};
    accum[currency1].pairs[currency2] = { convert: call.bid };
    accum[currency2].pairs[currency1] = { convert: 1/call.ask };
    return accum;
  }, {});
}

const removePairsWithCode = (pairs, code) => _.omitBy(pairs, (pair, filterKey) => {
  return filterKey === code;
})

const removePairsWithoutCode = (pairs, code) => _.omitBy(pairs, (pair, filterKey) => {
  return filterKey !== code;
})

const removeDeadendPairs = pairs => _.omitBy(pairs, (pair) => {
  return Object.keys(pair).length === 0;
});

const makeTriangles = graph => {
  return _.mapValues(graph, (currency, currencyCode) => {
    return _.mapValues(currency.pairs, (p, key1) => {
      const validPairs = removePairsWithCode(graph[key1].pairs, currencyCode);
      const leg3Values = _.mapValues(validPairs, (p, key2) => {
        const validPairs = removePairsWithoutCode(graph[key2].pairs, currencyCode);
        return { convert: graph[key1].pairs[key2].convert, pairs: validPairs };
      });
      return { convert: graph[currencyCode].pairs[key1].convert, pairs: removeDeadendPairs(leg3Values) };
    });
  });
}

const walkTriangles = triangles => {
  return _.reduce(triangles, (accum, value1, key1) => {
    const baseKey = key1;
    const baseValue = 1;
    _.map(value1, (value2, key2) => {
      const secondaryKey = baseKey + '_' + key2;
      const secondaryValue = baseValue * parseFloat(value2.convert);
      _.map(value2.pairs, (value3, key3) => {
        const thirdKey = secondaryKey + '_' + key3;
        const thirdValue = secondaryValue * parseFloat(value3.convert);
        _.map(value3.pairs, (value4, key4) => {
          const fourthValue = thirdValue * parseFloat(value4.convert);
          accum[thirdKey] = fourthValue;
        });
      });
    });
    return accum;
  }, {});
}

async function listMajors(auth) {
  const sheetValues = await getSheetValues({
    auth,
    spreadsheetId,
    range: bitstampCurrencyCells,
  })

  const currencyPairs = sheetValues.values;

  const tickerCalls = await Promise.all(currencyPairs.map(async pair => {
    const url = baseURL + pair[0] + '/';
    const response = await request(url);
    return {
      pair: pair[0],
      ask: response.body.ask,
      bid: response.body.bid,
      body: response.body,
    };
  }));

  const graph = createPairGraph(tickerCalls);
  const triangles = makeTriangles(graph);
  const results = walkTriangles(triangles);

  const goodResults = _.omitBy(results, result => {
    return result < 1;
  });

  const goodResultsAfterFee = _.mapValues(goodResults, result => {
    return result * 0.9975 * 0.9975 * 0.9975;
  });

  console.log(JSON.stringify(goodResultsAfterFee, null, 2));

  // const cellUpdates = tickerCalls.map(t => t.body.last);

  // setSheetValues({
  //   auth,
  //   spreadsheetId: spreadsheetId,
  //   range: bitstampCurrencyValueCells,
  //   valueInputOption: 'USER_ENTERED',
  //   resource: {
  //     majorDimension: 'COLUMNS',
  //     values: [cellUpdates]
  //   }
  // });

}

module.exports = listMajors;
