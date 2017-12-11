// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import teacher_artifacts from '../../build/contracts/School.json'
import reportcard_artifacts from '../../build/contracts/ReportCard.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var TeacherContract = contract(teacher_artifacts);
var ReportcardContract = contract(reportcard_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the MetaCoin abstraction for Use.
    TeacherContract.setProvider(web3.currentProvider);
    ReportcardContract.setProvider(web3.currentProvider);
    
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
      console.log(accounts);
      //self.refreshBalance();
    });
  },

  toAscii: function(hex) {
    var str = '',
      i = 0,
      l = hex.length;
    if (hex.substring(0, 2) === '0x') {
      i = 2;
    }
    for (; i < l; i += 2) {
      var code = parseInt(hex.substr(i, 2), 16);
      if (code === 0)
        continue; // this is added
      str += String.fromCharCode(code);
    }
    return str;
  },
  
  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  printImportantInformation: function () {
    TeacherContract.deployed().then(function (instance) {
      var divAddress = document.createElement("div");
      divAddress.appendChild(document.createTextNode("Address Teacher: " + instance.address));
      divAddress.setAttribute("class", "alert alert-info");
      document.getElementById("importantInformation").appendChild(divAddress);
      console.log('getschoolname');
      return instance.getSchoolName.call();
  }).then(function(sn){
    var divAddress = document.createElement("div");
    
    divAddress.appendChild(document.createTextNode("Name Teacher: " + App.toAscii(sn)));
    divAddress.setAttribute("class", "alert alert-info");
    document.getElementById("importantInformation").appendChild(divAddress);
  
  })
    ;
  ReportcardContract.deployed().then(function (instance) {
    var divAddress = document.createElement("div");
    divAddress.appendChild(document.createTextNode("Address Reportcard: " + instance.address));
    divAddress.setAttribute("class", "alert alert-info");
    document.getElementById("importantInformation").appendChild(divAddress);

    return instance.getStudentName.call();
}).then( function (sn) {
  var divAddress = document.createElement("div");
  
  divAddress.appendChild(document.createTextNode("Name Reportcard: " + sn));
  divAddress.setAttribute("class", "alert alert-info");
  document.getElementById("importantInformation").appendChild(divAddress);

});

      web3.eth.getAccounts(function (err, accs) {
          web3.eth.getBalance(accs[0], function (err1, balance) {
              var divAddress = document.createElement("div");
              var div = document.createElement("div");
              div.appendChild(document.createTextNode("Active Account: " + accs[0]));
              var div2 = document.createElement("div");
              div2.appendChild(document.createTextNode("Balance in Ether: " + web3.fromWei(balance, "ether")));
              divAddress.appendChild(div);
              divAddress.appendChild(div2);
              divAddress.setAttribute("class", "alert alert-info");
              document.getElementById("importantInformation").appendChild(divAddress);
          });

      });
  },
  
  /**
   * Teacher specific functions here
   */
  initTeacher: function () {
    //init Exchange
    App.start();
    App.printImportantInformation();
  },

  getStudentList: function() {
    var addressOfTeacher = document.getElementById("inputTeacherAddress").value;
    var teacherInstance = TeacherContract.at(addressOfTeacher);
    //return school.deployed().then(function(instance) {
    //  schoolInstance = instance;
    return teacherInstance.getNumberOfReportCards.call().then(function(numReportCards) {
      var items = [];
      console.log("num" );
      for (var i = 0; i < numReportCards.valueOf(); i++) {
        items[i] = i;
      }
      var actions = items.map(teacherInstance.getStudentInfoById.call);
      var results = Promise.all(actions); // pass array of promises
      return results.then(data => {
        console.log(data);
        var returnArray = [];
        for (var i = 0; i < data.length; i++) {
          returnArray.push({id: i, name: data[i][0], reportcardAddress: data[i][1]});
          $("#table-div tbody").append("<tr><td>"+i+"</td><td>" + data[i][0] + "</td><td>" + data[i][1] + "</td></tr>");
        }
        jQuery.each(data, function(index, value) {
          //console.log("<tr><td>"+index+"</td><td>" + value[0] + "</td><td>" + value[1] + "</td></tr>");
          $("table tbody").append("<tr><td>"+index+"</td><td>" + value[0] + "</td><td>" + value[1] + "</td></tr>");
     });
        return returnArray;

      });
    })
  },

  /**
   * Reportcard specific functions here
   */
  initReportcard: function () {
    //init Exchange
    App.start();
    App.printImportantInformation();
  },
  getStudentName: function () {
 
    var addressOfStudent = document.getElementById("inputAddressStudentGetName").value;
    ReportcardContract.at(addressOfStudent).then(function (instance) {
         return instance.getStudentName.call();
    }).then(function(sn){
      document.getElementById("inputAddressStudentNames").innerHTML = sn;
      return sn;
    });
},
getGPAGoal: function () {
  //function to add tokens to the exchange

  var addressOfStudent = document.getElementById("inputAddressStudentGetName").value;
  ReportcardContract.at(addressOfStudent).then(function (instance) {
      return instance.getGPAGoal.call();
  }).then(function(sn){
    document.getElementById("inputAddressGPAGoal").innerHTML = sn;
    return sn;
  });
},
searchReportcard: function () {
  let action1 = App.getStudentName();
  let action2 = App.getGPAGoal();
  let actions = [action1, action2];
  let results = Promise.all(actions);
  return results;
},

enrollStudent: function() {
  var addressOfTeacher = document.getElementById("inputEnrollTeacherAddress").value;
  var addressOfReportcard = document.getElementById("inputEnrollReportcardAddress").value;
  var studentName = "Novak";

  console.log(addressOfTeacher);
  console.log(addressOfReportcard);
  console.log(accounts[1]);
  console.log(studentName);
  var rcInstance = ReportcardContract.at(addressOfReportcard);
    return rcInstance.enroll(addressOfTeacher, studentName, {
      from: accounts[0],
      gas: 500000
    });
 },

refreshBalance: function() {
    var self = this;

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.getBalance.call(account, {from: account});
    }).then(function(value) {
      var balance_element = document.getElementById("balance");
      balance_element.innerHTML = value.valueOf();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error getting balance; see log.");
    });
  },

  sendCoin: function() {
    var self = this;

    var amount = parseInt(document.getElementById("amount").value);
    var receiver = document.getElementById("receiver").value;

    this.setStatus("Initiating transaction... (please wait)");

    var meta;
    MetaCoin.deployed().then(function(instance) {
      meta = instance;
      return meta.sendCoin(receiver, amount, {from: account});
    }).then(function() {
      self.setStatus("Transaction complete!");
      self.refreshBalance();
    }).catch(function(e) {
      console.log(e);
      self.setStatus("Error sending coin; see log.");
    });
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
  }

  App.start();
});
