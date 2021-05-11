App = {
  web3Provider: null,
  contract: null,
  web3: null,
  contractInstance: null,
  balance: null,
  account: null,
  issuedChecks: null,
  carryingChecks: null,
  checkbooks: null,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by MetaMask.
      App.web3Provider = window.ethereum;
      App.web3 = new Web3(window.ethereum);
    } /*else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      App.web3 = new Web3(App.web3Provider);
    }*/
    return App.initContract();
  },

  initContract: function() {
    // ChequeIssuance contract 
    //App.contract = new App.web3.eth.Contract(JSON.parse('[{"constant":false,"inputs":[{"name":"sender","type":"string"},{"name":"date","type":"string"}],"name":"chequebookRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"accountAddress","type":"string"},{"name":"name","type":"string"},{"name":"phoneNumber","type":"string"}],"name":"register","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"accountAddress","type":"string"}],"name":"getCustomerCarryingCheques","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"accountAddress","type":"string"}],"name":"getCustomerChequebooks","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"issuer","type":"string"},{"name":"recipient","type":"string"},{"name":"chequebookSerialNumber","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"issuanceDate","type":"string"},{"name":"dueDate","type":"string"},{"name":"dueDateSeconds","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"accountAddress","type":"string"}],"name":"getCustomerIssuedCheques","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"chequeSerial","type":"uint256"}],"name":"paid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'), '0x9BD2EbaEeF72E56dBd8F293E5cED4AddD2c07ee2'); 
    App.contract = new App.web3.eth.Contract(JSON.parse('[{"constant":false,"inputs":[{"name":"sender","type":"string"},{"name":"date","type":"string"}],"name":"chequebookRequest","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"string"},{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"string"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"accountAddress","type":"string"}],"name":"getCustomerCarryingCheques","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"chequeID","type":"uint256"}],"name":"payME","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"accountAddress","type":"string"}],"name":"getCustomerChequebooks","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"},{"name":"","type":"bool[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"issuer","type":"string"},{"name":"recipient","type":"string"},{"name":"chequebookSerialNumber","type":"uint256"},{"name":"amount","type":"uint256"},{"name":"issuanceDate","type":"string"},{"name":"dueDate","type":"string"},{"name":"dueDateSeconds","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"account","type":"string"}],"name":"deposit","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"accountAddress","type":"string"}],"name":"getCustomerIssuedCheques","outputs":[{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"uint256[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"},{"name":"","type":"string[]"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"}]'), '0x5ac3623347a174D58A39Fa8775e2757164bb42C5');
    
    return App.render();
  },

  // Listen for events emitted from the contract
  /*listenForEvents: function() {
    App.contracts.Election.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.votedEvent({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },*/

  render: function() {
    // if our site is not connected to the browser MetaMask extension
    if(App.web3 == null) {
      document.getElementById('no_account1').style.display = 'block';
      document.getElementById('no_account2').style.display = 'block';
    }
    else{
    App.web3.eth.getAccounts().then(function(accounts) {
      App.web3.defaultAccount = accounts;
      App.account = App.web3.defaultAccount.toString();
      if(App.account.length == 0) {
        document.getElementById('no_account1').style.display = 'block';
        document.getElementById('no_account2').style.display = 'block';
      }
      /*else {
        document.getElementById('no_account1').style.display = 'block';
        document.getElementById('no_account2').style.display = 'block';
      }*/
      var accountElement = $("#account");
      accountElement.html("Your Account: " + App.account);
      return App.contract.methods.balanceOf(App.account).call({from: App.account});
    }).then(function(balance) {
      App.balance = balance;
      var balanceElement = $("#balance");
      balanceElement.html("Your Balance: " + App.balance);
      return App.contract.methods.getCustomerChequebooks(App.account).call({from: App.account});
    }).then(function(chequebooks) {
      App.checkbooks = chequebooks;
      var chequebooksElement = $("#chequebooks");
      chequebooksElement.empty(); 
      var counter = 1;

      for (var i = 0; i < chequebooks[0].length; i++) {
        var chequebookTemplate = "<tr><th style='text-align:center'>" + counter++ + "</th><td style='text-align:center'>" + chequebooks[0][i] + "</td><td style='text-align:center'>" + chequebooks[1][i] + "</td><td style='text-align:center'>" + chequebooks[2][i] + "</td>";
        if(chequebooks[4][i] == true) chequebookTemplate += "<td style='text-align:center; background-color:#3c763d; color:white'>YES</td></tr>";
        else chequebookTemplate += "<td style='text-align:center; background-color:#a94442; color:white'>NO</td></tr>";
        chequebooksElement.append(chequebookTemplate);
      }
      return App.contract.methods.getCustomerIssuedCheques(App.account).call({from: App.account});
    }).then(function(issuedCheques) {
      App.issuedChecks = issuedCheques;
      var issuedChequesElement = $("#issuedCheques");
      issuedChequesElement.empty();
      var counter = 1;

      for (var i = 0; i < issuedCheques[0].length; i++) {
        var issuedChequesTemplate = "<tr><th style='text-align:center'>" + counter++ + "</th><td style='text-align:center'>" + issuedCheques[0][i] + "</td><td style='text-align:center'>" +  App.getChequeChequebookSerialNumber(issuedCheques[0][i]) + "</td><td style='text-align:center'>" + issuedCheques[1][i] + "</td><td style='text-align:center'>" + issuedCheques[2][i] + "</td><td style='text-align:center'>" + issuedCheques[3][i] + "</td><td style='text-align:center'>" + issuedCheques[4][i] + "</td>";
        if(issuedCheques[5][i] == "NOT PASSED")  issuedChequesTemplate += "<td style='text-align:center; background-color:#a94442; color:white'>" + issuedCheques[5][i] + "</td</tr>";
        else if(issuedCheques[5][i] == "PASSED")  issuedChequesTemplate += "<td style='text-align:center; background-color:#3c763d; color:white'>" + issuedCheques[5][i] + "</td</tr>";
        else  issuedChequesTemplate += "<td style='text-align:center; background-color:#737373; color:white'>" + issuedCheques[5][i] + "</td</tr>";
        issuedChequesElement.append(issuedChequesTemplate);
      }
      return App.contract.methods.getCustomerCarryingCheques(App.account).call({from: App.account});
    }).then(function(carryingCheques) {
      App.carryingChecks = carryingCheques;
      var carryingChequesElement = $("#carryingCheques");
      carryingChequesElement.empty();
      var counter = 1;

      for (var i = 0; i < carryingCheques[0].length; i++) {
        var carryingChequesTemplate = "<tr><th style='text-align:center'>" + counter++ + "</th><td style='text-align:center'>" + carryingCheques[0][i] + "</td><td style='text-align:center'>" + App.getChequeChequebookSerialNumber(carryingCheques[0][i]) + "</td><td style='text-align:center'>" + carryingCheques[1][i] + "</td><td style='text-align:center'>" + carryingCheques[2][i] + "</td><td style='text-align:center'>" + carryingCheques[3][i] + "</td><td style='text-align:center'>" + carryingCheques[4][i] + "</td>";
        if(carryingCheques[5][i] == "NOT PASSED")  carryingChequesTemplate += "<td style='text-align:center; background-color:#a94442; color:white'>" + carryingCheques[5][i] + "</td</tr>";
        else if(carryingCheques[5][i] == "PASSED")  carryingChequesTemplate += "<td style='text-align:center; background-color:#3c763d; color:white'>" + carryingCheques[5][i] + "</td</tr>";
        else  carryingChequesTemplate += "<td style='text-align:center; background-color:#737373; color:white'>" + carryingCheques[5][i] + "</td</tr>";
        /*var warnString = '';
        if(App.overdued(issuedCheques[5][i])){
          warnString += '<div><img src="warning.png"></div><div><p style="color:rgb(255, 255, 255)">You have ' +  + '</p></div>';
        }*/
        carryingChequesElement.append(carryingChequesTemplate);
      }
    }).then(function() {

    }).catch(function(error) {
      console.warn(error);
    });
  }
  },

  issueCheque: function() {
    App.hideWarning("wrong_value1","wrong_value2");
    App.hideWarning("dueDate_error1","dueDate_error2");
    App.hideWarning("empty_field1","empty_field2");
    App.hideWarning("wrong_chequebook1", "wrong_chequebook2");
    App.hideWarning("not_hex1","not_hex2");
    App.hideWarning("self_error1","self_error2");
    var recipientAddress = $('#input_recipientAddress').val();
    var amount = $('#input_amount').val();
    var dueDate = $('#input_dueDate').val();
    var issuanceDate = (new Date()).toDateString();
    if(recipientAddress == '' || amount == '' || dueDate == '' || dueDate == 'Example: 2020/01/01') App.showWarning("empty_field1","empty_field2");
    else if(App.isNumber(amount) || Number(amount[0]) == 0)  App.showWarning("wrong_value1","wrong_value2");
    else if(!App.isDateFormat(dueDate))  App.showWarning("dueDate_error1","dueDate_error2");
    else if(!App.isHEX(recipientAddress)) App.showWarning("not_hex1","not_hex2");
    else if(recipientAddress == App.account)  App.showWarning("self_error1","self_error2");
    else if(App.checkbooks[0][0] === undefined)  App.showWarning("wrong_chequebook1", "wrong_chequebook2");
    else if(App.checkbooks[1][App.checkbooks[0].length - 1] == 0)  App.showWarning("wrong_chequebook1", "wrong_chequebook2");
    else {
      var chequebookSerialNumber = App.checkbooks[0][App.checkbooks[0].length - 1];
      dueDate = new Date(dueDate);
      App.contract.methods.issue(App.account, recipientAddress, chequebookSerialNumber, Number(amount), issuanceDate, dueDate.toDateString(), dueDate.getTime() / 1000).send({from: App.account}).then(function(transactionHash) {
        console.log(transactionHash);
        App.showWarning("transaction-successful1","transaction-successful2");
      }).catch(function(error) {
        console.warn(error);
        App.showWarning("transaction-failed1","transaction-failed2");  
      }).then(function() {
        App.render();
      });
    }
  },

  chequebookRequest: function() {
    App.hideWarning("chequebook_error1","chequebook_error2");
    var last = App.checkbooks[0].length - 1;
    if(App.checkbooks[1][last] > 0) App.showWarning("chequebook_error1","chequebook_error2");
    else {
      var date = new Date();
      console.log(App.account);
      App.contract.methods.chequebookRequest(App.account, date.toDateString()).send({from: App.account}).then(function (transactionHash) {
        console.log(transactionHash);
        App.showWarning("transaction-successful1","transaction-successful2");
      }).catch(function(error) {
        console.warn(error);
        App.showWarning("transaction-failed1","transaction-failed2");
      }).then(function() {
        App.render();
      });
    }
  },

  payME: function() {
    App.hideWarning("wrong_value1","wrong_value2");
    App.hideWarning("call_error1","call_error2");
    var chequeID = $("#call_value").val();
    var notAvailable = true;
    for(var i=0;i<App.carryingChecks[0].length;i++) {
      if((App.carryingChecks[0][i] == Number(chequeID)) && (App.carryingChecks[5][i] == "NOT PASSED")) notAvailable = false;
    }
    if(chequeID == '' || App.isNumber(chequeID) || Number(chequeID[0]) == 0)  App.showWarning("wrong_value1","wrong_value2");
    else if(notAvailable) App.showWarning("call_error1","call_error2");
    else {
      App.contract.methods.payME(chequeID).send({from: App.account}).then(function(transactionHash) {
        console.log(transactionHash);
        App.showWarning("transaction-successful1","transaction-successful2");
      }).catch(function(error) {
        console.warn(error);
        App.showWarning("transaction-failed1","transaction-failed2");
      }).then(function() {
        App.render();
      });
    }
  },

  deposit: function() {
    App.hideWarning("wrong_value1","wrong_value2");
    var amount = $("#deposit_value").val();
    if(amount == '' || App.isNumber(amount) || Number(amount[0]) == 0)  App.showWarning("wrong_value1", "wrong_value2");
    else {
      App.contract.methods.deposit(App.account).send({from: App.account, value: amount}).then(function(transactionHash) {
        console.log(transactionHash);
        App.showWarning("transaction-successful1","transaction-successful2");
      }).catch(function(error) {
        console.warn(error);
        App.showWarning("transaction-failed1","transaction-failed2");
      }).then(function() {
        App.render();
      });
    }
  },

  withdraw: function() {
    App.hideWarning("wrong_value1","wrong_value2");
    App.hideWarning("low_balance1","low_balance2");
    var amount = $("#withdrawal_value").val();
    if(amount == '' || App.isNumber(amount) || Number(amount[0]) == 0)  App.showWarning("wrong_value1", "wrong_value2");
    else if(App.balance < Number(amount)) App.showWarning("low_balance1","low_balance2");
    else {
      App.contract.methods.withdraw(App.account, amount).send({from: App.account}).then(function(transactionHash) {
        console.log(transactionHash);
        App.showWarning("transaction-successful1","transaction-successful2");
      }).catch(function(error) {
        console.warn(error);
        App.showWarning("transaction-failed1","transaction-failed2");
      }).then(function() {
        App.render();
      });
    }
  },

  getChequeChequebookSerialNumber: function(x) {
    var chequebookSN = '';
    for(var i=0; i<x.length-2; i++) {
      chequebookSN += x[i];
    }
    return chequebookSN;
  },

  // Checks whether the input is a number or not
  isNumber: function(value) {
    var naN = false;
    for(var i=0; i<value.length; i++) {
      if(!(value.charCodeAt(i) >= 48 && value.charCodeAt(i) <= 57)){
        naN = true;
        break;
      }  
    }
    return naN;
  },

  showWarning: function(id1, id2) {
    var icon = document.getElementById(id1);
    var txt = document.getElementById(id2);
    icon.style.display = 'block';
    txt.style.display = 'block';
    setInterval(function() {
      var warn = document.getElementById(id1);
      if(warn.style.visibility == "hidden")  warn.style.visibility = "visible";
      else  warn.style.visibility = "hidden";
    },500);
    setTimeout(function() {
      icon.style.display = 'none';
      txt.style.display = 'none';
    },15000);
  },

  hideWarning: function(id1, id2) {
    var icon = document.getElementById(id1);
    var txt = document.getElementById(id2);
    icon.style.display = 'none';
    txt.style.display = 'none';
  }, 

  isDateFormat: function(date) {
    var isDate = true;
    if(date.length != 10) isDate = false;
    else if(App.isNumber(date[0]) || App.isNumber(date[1]) || App.isNumber(date[2]) || App.isNumber(date[3]) || App.isNumber(date[5]) || App.isNumber(date[6]) || App.isNumber(date[8]) || App.isNumber(date[9]) || date[4] != '/' || date[7] != '/') isDate = false;
    return isDate;
  },

  isHEX: function(value) {
    if(value[0] != "0") return false;
    if((value[1] != "x") && (value[1] != "X"))  return false;
    var hex = true;
    for(var i=2;i<value.length;i++) {
      if(!((value.charCodeAt(i) >= 48 && value.charCodeAt(i) <=  57) || (value.charCodeAt(i) >= 65 && value.charCodeAt(i) <= 70) || (value.charCodeAt(i) >= 97 && value.charCodeAt(i) <= 102))) {
        hex = false;
        break;
      }
    }
    return hex;
  }
};

$(function() {
  $(window).load(function () {
    App.init();
  });
});