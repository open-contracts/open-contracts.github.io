var provider = null;
var user = null;
var contract = null;
var initialized = false;


function init() {
  $('#network').html("starting connection...");
  const {ethereum} = window;
  ethereum.on('chainChanged', (_chainId) => window.location.reload());
  const newAccounts = ethereum.request({method: 'eth_requestAccounts'});
  provider =  new ethers.providers.Web3Provider(ethereum, 'any');
  provider.getNetwork().then((chain) => {$('#network').html(chain.name);});
  //++ const openProvider = new opencontracts.providers.Web3Provider(provider);
  user = provider.getSigner();
  initialized = true;
}

// executed by "Load Contract" button
function loadContract() {
  // Connect wallet if necessary
  if (!initialized) {
    if (window.ethereum) {
      init();
    } else {
      window.addEventListener('ethereum#initialized', setup, {
        once: true,
      });
      setTimeout(init, 30000); // 30 seconds
    }
  }
	
  // Load Contract
  var contractAddress = $('#contractAddress').val();
  var contractABI = JSON.parse($('#contractABI').val());
  //++ const openContractABI = JSON.parse($('#oracle.py').val());
  contract = new ethers.Contract(contractAddress, contractABI, provider).connect(user);
  //++ const openContract = new opencontracts.Contract(contract, openContractABI)
    
  // add a button for every function in our contract
  var contractFunctions = contract.interface.fragments;
  var fnames = "<p><b>Functions:</b></p>";
  for (let i = 1; i < contractFunctions.length; i++) {
    fname = contractFunctions[i].name;
    fnames += `<input id=${fname} type="submit" value="${fname}" onclick="showFunction(${fname})" />`;
	}
  fnames += "<br />"
  $('#functionNames').html(fnames);
  $('#currentFunction').html("");
  $('#results').html("");
}

// executed by clicking on a function button
function showFunction(fname) {
  fname = fname.value;
  var fjson = contract.interface.fragments.filter(x=>x.name==fname)[0];
  var currentFunction = `<p><b>Function name:</b>  ${fname}</p>`;
  currentFunction += `<p><b>State mutability:</b> ${fjson.stateMutability}</p>`;
  currentFunction += '<form id="contractForm" action="javascript:void(0);"> <p><b>Arguments:</b>';
  if (fjson.inputs.length == 0 && fjson.stateMutability!="payable") {currentFunction += " none  <br />"}
  if (fjson.stateMutability=="payable") {
  	currentFunction += `<div>	<label for="msgValue">messageValue (ETH):	</label> <input id="msgValue" type="text" value="0" size="60" /></div>`;
  }
  for (let i = 0; i < fjson.inputs.length; i++) {
  	var input = fjson.inputs[i];
  	var inputname = input.name;
  	if (inputname == null) {inputname = input.type}
  	currentFunction += `<div>	<label for="${inputname}">	${inputname}:	</label> <input id="${inputname}" type="text" value="${input.type}" size="60" /> 	</div>`;
	}
  currentFunction +=`<br /> <input type="submit" value="Call" onclick=callFunction(${fname}) /> </form>`
  $('#currentFunction').html(currentFunction)
  $('#results').html("");
}


// executed by the Call button
async function callFunction(fname) {
   fname = fname.value;
   var fjson = contract.interface.fragments.filter(x=>x.name==fname)[0];
   var args = [];
   for (let i = 0; i < fjson.inputs.length; i++) {
     	var input = fjson.inputs[i];
     	var inputname = input.name;
     	if (inputname == null) {inputname = input.type}
   		args.push($(`#${inputname}`).val());
   }
   
   if (fjson.stateMutability=="payable") {
      var msgVal = ethers.utils.parseEther($("#msgValue").val());
      args.push({value: msgVal});
   }

   try {
   	 var txReturn = await contract.functions[fname].apply(this, args);
     if (fjson.stateMutability=="view") {
    	 $('#results').html(txReturn.map(x => x.toString()));
     } else {
       $('#results').html("Waiting for confirmation...");
       await txReturn.wait();
     	 $('#results').html("Confirmed!");
     }
     console.log(txReturn);
   } catch(error) {
     $('#results').html(error.message);
   }
   
}


function submitOracle() {
    var enclaveProviderIP = $('#enclaveProviderIP').val();
    var oracleCode =  $('#oracleCode').val();	
    console.log("wss://" + enclaveProviderIP + ":8080/")
    var ws = new WebSocket("wss://" + enclaveProviderIP + ":8080/");
    ws.onopen = function(event) {
        console.log("WebSocket is open now."); 
	// todo: request and verify attestation doc
        ws.send(JSON.stringify({fname: 'submit_oracle', fileContents: oracleCode}));
        ws.send(JSON.stringify({fname: 'run_oracle'}));
    };
    ws.onmessage = function (event) {
        data = JSON.parse(event.data);
	if (data['fname'] == "print") {
		document.getElementById("enclaveOutput").innerHTML += data['string'] + "<br>";
	} else if (data['fname'] == "xpra") {
		document.getElementById("xpra").innerHTML = "Opening " + data['url'] + " in interactive session. <br>"
		(new Promise(r => setTimeout(r, 5000))).then(r => document.getElementById("xpra").innerHTML += '<iframe src='+data['session']+' title="Xpra Window" width="100%" height="1200" ></iframe>')
	}
    };
}



function OLDsubmitOracle() {
    var enclaveProviderIP = $('#enclaveProviderIP').val();
    var oracleCode =  $('#oracleCode').val();

    $.ajax({
          type: "POST",
          url: "https://" + enclaveProviderIP + ":8080",
          data: JSON.stringify({"function": "submit_oracle", "fileContents": oracleCode}),
	  async: false,
          success: function(){$('#enclaveOutput').html("submitted");},
          dataType: "text",
          contentType : "text/plain"
    });
    $.ajax({
          type: "POST",
          url: "https://" + enclaveProviderIP + ":8080",
          data: JSON.stringify({"function": "run_oracle"}),
          success: function(){$('#enclaveOutput').html("ran!");},
          dataType: "text",
          contentType : "text/plain"
    });
    

}

function sendHttpPut() {
    var fnName = $('#function').val();
    var oracleCode = $('#oracleCode').val();
    var domain = $('#domain').val();
    
//    const XHR = new XMLHttpRequest();
//
//    // Set up our request
//    XHR.open( 'POST', 'https://' + domain + ':8080', true);
//    XHR.setRequestHeader("Accept", "application/json");
//    XHR.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    var data = JSON.stringify({"function": fnName, "fileContents": oracleCode})
    // Send our FormData object; HTTP headers are set automatically
//    XHR.send( data );

    $.ajax({
          type: "POST",
          url: "https://" + domain + ":8080",
          data: data,
          success: function(){},
          dataType: "text",
          contentType : "text/plain"
    });
}

function xpra() {
$('#xpra').html('<iframe src=/xpra/connect.html'+window.location.search+' title="Xpra Window" width="100%" height="1200" ></iframe>')
}
