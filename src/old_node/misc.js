function calcBest() {
  console.log();
  console.log(state);
  let highestBid;
  let bidExchange;
  let lowestAsk;
  let askExchange;
  if(state.bitfinex.bidPrice > state.bitstamp.bidPrice){
    highestBid = state.bitfinex.bidPrice;
    bidExchange = 'bitfinex';
  }
  else {
    highestBid = state.bitstamp.bidPrice;
    bidExchange = 'bitstamp';
  }
  if(state.bitfinex.askPrice < state.bitstamp.askPrice){
    lowestAsk = state.bitfinex.askPrice;
    askExchange = 'bitfinex';
  }
  else {
    lowestAsk = state.bitstamp.askPrice;
    askExchange = 'bitstamp';
  }
  console.log(lowestAsk);
  console.log(highestBid);
  const baseReturn = highestBid - lowestAsk;
  const actualReturn = ((highestBid * fees[bidExchange].fee) - lowestAsk) * fees[askExchange].fee;
  console.log('Best base return: ' + baseReturn/lowestAsk*100);
  console.log('Best actual return: ' + actualReturn/lowestAsk*100);
  console.log(PAIR + ' is moving to ' + askExchange);
}
