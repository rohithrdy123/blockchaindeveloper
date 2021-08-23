var Web3 = require('web3');
var EthereumTransaction = require('ethereumjs-tx').Transaction;
var url = 'https://ropsten.infura.io/v3/a61c441b7f924628a788e1b81ac1eca5';
var web3 = new Web3(url);

var sendingAddress = '0x3fA39bEf9C93de1D4A8baae99edF22328BCF2717';
var receivingAddress = '0x81cDee16BF36D666054eD85D9BA8356bd2CEa025';


web3.eth.getBalance(sendingAddress).then(console.log);
web3.eth.getBalance(receivingAddress).then(console.log);

web3.eth.getGasPrice().then(console.log);
web3.eth.getBlockTransactionCount('0x3bc171199eef5a20a434aa3945a75012f63241c29f37b444b80777bc5f850e25').then(console.log);
web3.eth.getUncle(500, 0).then(console.log);

var rawTransaction = {
    nonce: 0,
    to: receivingAddress,
    gasPrice: 20000000,
    gasLimit: 30000,
    value: 100,
    data: '0x'
}


//var privateKeySender = '261932716562fb0d1f3e23d3fccd19c3fc8a9e467dc342475ed3610c0d426abc';
//var privateKeySenderHex = new Buffer(privateKeySender, 'hex');
//var transaction = new EthereumTransaction(rawTransaction);
//transaction.sign(privateKeySenderHex);


//var serializedTransaction = transaction.serialize();
//web3.eth.sendSignedTransaction(serializedTransaction);



