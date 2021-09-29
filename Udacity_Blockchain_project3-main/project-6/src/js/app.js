App = {
    web3Provider: null,
    contracts: {},
    emptyAddress: "0x0000000000000000000000000000000000000000",
    sku: 0,
    upc: 0,
    metamaskAccountID: "0x0000000000000000000000000000000000000000",
    ownerID: "0x0000000000000000000000000000000000000000",
    originFarmerID: "0x0000000000000000000000000000000000000000",
    originFarmName: null,
    originFarmInformation: null,
    originFarmLatitude: null,
    originFarmLongitude: null,
    productNotes: null,
    productPrice: 0,
    distributorID: "0x0000000000000000000000000000000000000000",
    retailerID: "0x0000000000000000000000000000000000000000",
    consumerID: "0x0000000000000000000000000000000000000000",

    init: async function () {
        App.readForm();
        /// Setup access to blockchain
        return await App.initWeb3();
    },

    readForm: function () {
        App.sku = $("#sku").val();
        App.upc = $("#upc").val();
        App.ownerID = $("#ownerID").val();
        App.originFarmerID = $("#originFarmerID").val();
        App.originFarmName = $("#originFarmName").val();
        App.originFarmInformation = $("#originFarmInformation").val();
        App.originFarmLatitude = $("#originFarmLatitude").val();
        App.originFarmLongitude = $("#originFarmLongitude").val();
        App.productNotes = $("#productNotes").val();
        App.productPrice = $("#productPrice").val();
        App.distributorID = $("#distributorID").val();
        App.retailerID = $("#retailerID").val();
        App.consumerID = $("#consumerID").val();
        console.log(
            App.sku,
            App.upc,
            App.ownerID, 
            App.originFarmerID, 
            App.originFarmName, 
            App.originFarmInformation, 
            App.originFarmLatitude, 
            App.originFarmLongitude, 
            App.productNotes, 
            App.productPrice, 
            App.distributorID, 
            App.retailerID, 
            App.consumerID
        );
    },

    initWeb3: async function () {
        /// Find or Inject Web3 Provider
        /// Modern dapp browsers...
        if (window.ethereum) {
            App.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.error("User denied account access")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            App.web3Provider = window.web3.currentProvider;
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }

        App.getMetaskAccountID();

        return App.initSupplyChain();
    },

    getMetaskAccountID: function () {
        web3 = new Web3(App.web3Provider);

        // Retrieving accounts
        web3.eth.getAccounts(function(err, res) {
            if (err) {
                console.log('Error:',err);
                return;
            }
            console.log('getMetaskID:',res);
            App.metamaskAccountID = res[0];

        })
    },

    deployRole: function (jsonRole, RoleName) {
        
        /// JSONfy the smart contracts
        $.getJSON(jsonRole, function(data) {
            console.log('data',data);
            var RoleArtifact = data;
            
            switch(RoleName) {
                case "Farmer":
                    App.contracts.FarmerRole = TruffleContract(RoleArtifact);
                    App.contracts.FarmerRole.setProvider(App.web3Provider);
                case "Distributor":
                    App.contracts.DistributorRole = TruffleContract(RoleArtifact);
                    App.contracts.DistributorRole.setProvider(App.web3Provider);
                case "Retailer":
                    App.contracts.RetailerRole = TruffleContract(RoleArtifact);
                    App.contracts.RetailerRole.setProvider(App.web3Provider);
                case "Consumer":
                    App.contracts.ConsumerRole = TruffleContract(RoleArtifact);
                    App.contracts.ConsumerRole.setProvider(App.web3Provider);
            }
        });
    },

    

    initSupplyChain: function () {
        /// Source the truffle compiled smart contracts
        var jsonSupplyChain='../../build/contracts/SupplyChain.json';
        var jsonFarmerRole='../../build/contracts/FarmerRole.json';
        var jsonDistributorRole='../../build/contracts/DistributorRole.json';
        var jsonRetailerRole='../../build/contracts/RetailerRole.json';
        var jsonConsumerRole='../../build/contracts/ConsumerRole.json';
        /// Deploy Roles
        App.deployRole(jsonFarmerRole, "Farmer");
        App.deployRole(jsonDistributorRole, "Distributor");
        App.deployRole(jsonRetailerRole, "Retailer");
        App.deployRole(jsonConsumerRole, "Consumer");
        /// JSONfy the smart contracts
        $.getJSON(jsonSupplyChain, function(data) {
            console.log('data',data);
            var SupplyChainArtifact = data;
            App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
            App.contracts.SupplyChain.setProvider(App.web3Provider);
            
            App.fetchItemBufferOne();
            App.fetchItemBufferTwo();
            App.fetchEvents();
            

        });

        return App.bindEvents();
    },

    bindEvents: function() {
        $(document).on('click', App.handleButtonClick);
    },

    handleButtonClick: async function(event) {
        event.preventDefault();

        App.getMetaskAccountID();

        var processId = parseInt($(event.target).data('id'));
        console.log('processId',processId);

        switch(processId) {
            case 1:
                return await App.harvestItem(event);
                break;
            case 2:
                return await App.processItem(event);
                break;
            case 3:
                return await App.packItem(event);
                break;
            case 4:
                return await App.sellItem(event);
                break;
            case 5:
                return await App.buyItem(event);
                break;
            case 6:
                return await App.shipItem(event);
                break;
            case 7:
                return await App.receiveItem(event);
                break;
            case 8:
                return await App.purchaseItem(event);
                break;
            case 9:
                return await App.fetchItemBufferOne(event);
                break;
            case 10:
                return await App.fetchItemBufferTwo(event);
                break;
            case 11:
                return await App.addFarmerRole(event);
                break;
            case 12:
                return await App.addDistributorRole(event);
            break;
                case 13:
                return await App.addRetailerRole(event);
                break;
            case 14:
                return await App.addConsumerRole(event);
                break;
            }
    },

    harvestItem: function() {
        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.harvestItem.sendTransaction(
                App.upc, 
                $("#originFarmerID").val(), 
                App.originFarmName, 
                App.originFarmInformation, 
                App.originFarmLatitude, 
                App.originFarmLongitude, 
                App.productNotes,
                {"from": App.metamaskAccountID,
                 "gas": 4712388,
                 "gasPrice": 100000000000}
            )
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('harvestItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    processItem: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.processItem.sendTransaction(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('processItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },
    
    packItem: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.packItem.sendTransaction(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('packItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    sellItem: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const productPrice = web3.toWei(1, "ether");
            console.log('productPrice',productPrice);
            return instance.sellItem.sendTransaction(App.upc, App.productPrice, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('sellItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    buyItem: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            const walletValue = web3.toWei(3, "ether");
            return instance.buyItem.sendTransaction(App.upc, {from: App.metamaskAccountID, value: walletValue});
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('buyItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    shipItem: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.shipItem.sendTransaction(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('shipItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    receiveItem: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.receiveItem.sendTransaction(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('receiveItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    purchaseItem: function () {

        App.contracts.SupplyChain.deployed().then(function(instance) {
            return instance.purchaseItem.sendTransaction(App.upc, {from: App.metamaskAccountID});
        }).then(function(result) {
            $("#ftc-events").text(result);
            console.log('purchaseItem',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchItemBufferOne: function () {
        App.upc = parseInt($('#upc').val());
        console.log('upc',App.upc);

        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferOne.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferOne', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    fetchItemBufferTwo: function () {
        App.upc = parseInt($('#upc').val());
        console.log('upc',App.upc);
                        
        App.contracts.SupplyChain.deployed().then(function(instance) {
          return instance.fetchItemBufferTwo.call(App.upc);
        }).then(function(result) {
          $("#ftc-item").text(result);
          console.log('fetchItemBufferTwo', result);
        }).catch(function(err) {
          console.log(err.message);
        });
    },

    addFarmerRole: function () {

        App.contracts.FarmerRole.deployed().then(function(instance) {
            return instance.addFarmer.call($("#originFarmerID").val());
        }).then(function(result) {
            console.log('Farmer added',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addDistributorRole: function () {

        App.contracts.DistributorRole.deployed().then(function(instance) {
            return instance.addDistributor.call($("#distributorID").val());
        }).then(function(result) {
            console.log('Distributor added',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addRetailerRole: function () {

        App.contracts.RetailerRole.deployed().then(function(instance) {
            return instance.addRetailer.call($("#retailerID").val());
        }).then(function(result) {
            console.log('Retailer added',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    addConsumerRole: function () {

        App.contracts.ConsumerRole.deployed().then(function(instance) {
            return instance.addConsumer.call($("#consumerID").val());
        }).then(function(result) {
            console.log('Consumer added',result);
        }).catch(function(err) {
            console.log(err.message);
        });
    },

    fetchEvents: function () {
        if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function") {
            App.contracts.SupplyChain.currentProvider.sendAsync = function () {
                return App.contracts.SupplyChain.currentProvider.send.apply(
                App.contracts.SupplyChain.currentProvider,
                    arguments
              );
            };
        }

        App.contracts.SupplyChain.deployed().then(function(instance) {
        var events = instance.allEvents(function(err, log){
          if (!err)
            $("#ftc-events").append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
        });
        }).catch(function(err) {
          console.log(err.message);
        });
        
    }
};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
