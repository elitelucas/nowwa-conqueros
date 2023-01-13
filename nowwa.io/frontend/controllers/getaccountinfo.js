var ethers = require('ethers')
var ETHERSCAN_APIKEY = "73WDG3RJD2NICPB34WDN7EBGTZHYNXVEDN";
var account = "0xd54a348FB1288fF4AB3d770FFC973E730eBa1d6f"
var tokenaddress = '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT


var api = require('etherscan-api').init(ETHERSCAN_APIKEY);

// var balance = api.account.balance(account);
// //response - { status: '1', message: 'OK', result: '14592755639385812' }
// balance.then(function (data) {
//   console.log(formatBalance(data.result, 18, 3), 'ETH');
// });

// var supply = api.account.tokenbalance(
//   account,
//   '',
//   tokenaddress
// );
// supply.then(function (data) {
//   console.log(formatBalance(data.result, 6, 3), 'USDT');
// });

var txlist = api.account.txlist(account, 1, 'latest', 1, 100, 'asc');
txlist.then(function (data) {
  console.log(data.result);
});



function formatBalance(value, decimals = 18, maxFraction = 0) {
  const formatted = ethers.utils.formatUnits(value, decimals)
  if (maxFraction > 0) {
    const split = formatted.split('.')
    if (split.length > 1) {
      return split[0] + '.' + split[1].substr(0, maxFraction)
    }
  }
  return formatted
}