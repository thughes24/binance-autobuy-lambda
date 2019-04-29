//Binance Market Order Script
//Built by Tom Hughes 
//
//This script is used on Amazon AWS Lambda with Cloudwatch to automate buying a certain amount of cryptocurrency at a specified recurring basis. 
//
//please see https://github.com/thughes24/binance-autobuy-aws-lambda for instructions on how to set it up.

const errorHandler = (error) => {
  console.log("***************")
  console.log(`The following error occured on ${Date()}`)
  console.log(error)
  console.log("***************")
  process.exit()
}

exports.handler = () => {

  // executeing all code outside the global scope to avoid caching issues with aws lambda

  const MARKET = process.env.MARKET,
        AMOUNT = process.env.AMOUNT,
        API_KEY = process.env.API_KEY,
        API_SECRET = process.env.API_SECRET
  
  const binance = require('node-binance-api')().options({
    APIKEY: API_KEY,
    APISECRET: API_SECRET,
    useServerTime: true // If you get timestamp errors, synchronize to server time at startup
  });

  binance.exchangeInfo((error, data) => {
    if (error) { errorHandler(error)}
    let filtered_market = data.symbols.filter((item) => item.symbol === MARKET)
    if (filtered_market.length != 1) { errorHandler(`Market ${MARKET} could not be found`) }
    let step_size = filtered_market[0].filters.filter((x) => x.filterType === 'LOT_SIZE')[0]['stepSize'];
    binance.prices(MARKET, (error, ticker) => {
      if (error) { errorHandler(error)}
      let price = ticker[MARKET];
      let coinAmount = (AMOUNT/price)
      coinAmount = (Math.round((1/step_size)*coinAmount)/(1/step_size)).toFixed(8)
      console.log('---------------')
      console.log(' ')
      console.log(`About to buy ${coinAmount} worth of ${MARKET}`)
      console.log(' ')
      binance.marketBuy(MARKET, coinAmount, (error, response) => {
        if (error) {
          errorHandler(error.body);
        } else {
          console.log(`Successfully bought ${coinAmount} of ${MARKET} at ${Date()}`)
          console.log(' ')
          console.log('---------------')
        }
      });
    });
  });
}
