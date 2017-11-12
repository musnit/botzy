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

const sheetValues = await getSheetValues({
  auth,
  spreadsheetId,
  range: bitstampCurrencyCells,
})

const currencyPairs = sheetValues.values;

const cellUpdates = tickerCalls.map(t => t.body.last);

setSheetValues({
  auth,
  spreadsheetId: spreadsheetId,
  range: bitstampCurrencyValueCells,
  valueInputOption: 'USER_ENTERED',
  resource: {
    majorDimension: 'COLUMNS',
    values: [cellUpdates]
  }
});
