const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "a61c441b7f924628a788e1b81ac1eca5";
//
//const fs = require('fs');
//const mnemonic = fs.readFileSync(".secret").toString().trim();
mnemonic = "minimum type couple head apology move slight gown film define series student"

module.exports = {
  networks: {
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*" // Match any network id
    // },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
      network_id: 3,       // rinkeby's id
      gas: 4500000,        // rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000
  }
  },

  compilers: {
    solc: {
      version: "0.4.24"  // ex:  "0.4.20". (Default: Truffle's installed solc)
    }
  }

};