// Authenticate the user, and get permission to request payments from them:
var scopes = ['username', 'payments'];

// Read more about this callback in the SDK reference:
function onIncompletePaymentFound(payment) { /* ... */ };

Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
}).catch(function(error) {
  console.error(error);
});

var axiosClient = axios.create({
  baseURL: "https://pipi-server.herokuapp.com/api",
  timeout: 30000
})

var config = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
}

async function paste() {
  const text = await navigator.clipboard.readText();
  document.getElementById("address").value = text
}

var web3 = new Web3()

function transfer() {
  var amount = document.getElementById("amount").value;
  var address = document.getElementById("address").value;
  showWarning()
  if(!web3.utils.isAddress(address)) return 
    Pi.createPayment({
        // Amount of π to be paid:
        amount: parseFloat(amount),
        // An explanation of the payment - will be shown to the user:
        memo: address,
        // An arbitrary developer-provided metadata object - for your own usage:
        metadata: { 
          bsc_address: address
         }
      }, {
        // Callbacks you need to implement - read more about those in the detailed docs linked below:
        onReadyForServerApproval: function(paymentId) {
          console.log({paymentId})
          axiosClient.post(`/payments/${paymentId}/approve`, {}, config)
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        },
        onReadyForServerCompletion: function(paymentId, txid) {
          console.log({paymentId, txid})

          axiosClient.post(`/payments/${paymentId}/complete`, {
            txid: txid
          })
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        },
        onCancel: function(paymentId) { 
            alert(`User cancelled the payment`)
         },
        onError: function(error, payment) { 
         },
      });
}

function showWarning() {
  var addressWarning = document.getElementById("address-warning")
  var amountWarning = document.getElementById("amount-warning")
  var address = document.getElementById("address").value
  var amount = document.getElementById("amount").value

  if(address !== "" && !web3.utils.isAddress(address)) {
    addressWarning.style.display = 'block'
  } else {
    addressWarning.style.display = 'none'
  }

  if(amount !== "" && !parseFloat(amount) > 0) {
    amountWarning.style.display = 'block'
  } else {
    amountWarning.style.display = 'none'
  }
}

function onScanSuccess(decodedText, decodedResult) {
  // Handle on success condition with the decoded text or result.
  let address
  if(decodedText.indexOf(':') > 0) {
    address = decodedText.split(":")[1]
  } else {
    address = decodedText
  }
  document.getElementById("address").value = address
  console.log(`Scan result: ${decodedText}`, decodedResult);
  html5QrcodeScanner.clear()
}

function onScanError(errorMessage) {
  // handle on error condition, with error message
  console.log("Error", errorMessage)
}

var html5QrcodeScanner = new Html5QrcodeScanner(
"reader", { fps: 10, qrbox: {width: 250, height: 250} });

function addCloseIcon() {
  //remove icon info
  var imgElement = document.querySelector('img[alt="Info icon"]')
  imgElement.style.display = 'none'

  var btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'btn-close'

  btn.addEventListener('click', function () {
    html5QrcodeScanner.clear()
  })

  document.getElementById('reader').appendChild(btn)


}

setInterval(() => {
  showWarning()
}, [3000])

function startScan() {
  html5QrcodeScanner.render(onScanSuccess, onScanError);
  addCloseIcon()
}
