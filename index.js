import axios from 'axios';

// Authenticate the user, and get permission to request payments from them:
var scopes = ['username', 'payments'];

// Read more about this callback in the SDK reference:
function onIncompletePaymentFound(payment) { /* ... */ };

Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
  alert(`Hi there! You're ready to make payments!`);
}).catch(function(error) {
  console.error(error);
});

var axiosClient = axios.create({
  baseURL: "https://api.minepi.com/v2",
  timeout: 30000
})

var config = {
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Authorization': "Bearer m0zq8wffvvqbkvwpdiasqtrsgwmak3yei41sgu9j8hhccdutlh7utjh7mqtbaito"
  }
}

function donate() {
  var amount = document.getElementById("amount").value;
  var address = document.getElementById("address").value;
  console.log({amount, address})
    Pi.createPayment({
        // Amount of π to be paid:
        amount: parseFloat(amount),
        // An explanation of the payment - will be shown to the user:
        memo: "address",
        // An arbitrary developer-provided metadata object - for your own usage:
        metadata: { 
          kittenId: 1234
         }, // e.g: { kittenId: 1234 }
      }, {
        // Callbacks you need to implement - read more about those in the detailed docs linked below:
        onReadyForServerApproval: function(paymentId) {
          alert(paymentId)
          axiosClient.post(`/payments/${paymentId}/approve`, config, {})
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        },
        onReadyForServerCompletion: function(paymentId, txid) {
          console.log(txid)
          axiosClient.post(`/payments/${paymentId}/complete`, config, {})
          .then(function (response) {
            console.log(response);
          })
          .catch(function (error) {
            console.log(error);
          });
        },
        onCancel: function(paymentId) { 
            alert(`onCancel paymentId: ${paymentId}`)
         },
        onError: function(error, payment) { 
            alert(`onCancel paymentId: ${payment}`)
         },
      });
}