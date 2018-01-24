const oldCurrencies = oldc;
const newCurrencies = newc;

newCurrencies.reduce((accum, c) => {key=c.toLowerCase().split('_').join(''); accum[key]=c;return accum;}, {})

const newcurrs = Array.from(new Set(newc.map(c=>c.split('_')).reduce((accum,c)=>{accum = accum.concat(c);return accum;},[])))
