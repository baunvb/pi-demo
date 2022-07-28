// Authenticate the user, and get permission to request payments from them:
const scopes = ['payments'];

// Read more about this callback in the SDK reference:
function onIncompletePaymentFound(payment) { /* ... */ };

Pi.authenticate(scopes, onIncompletePaymentFound).then(function(auth) {
  alert(`Hi there! You're ready to make payments!`);
}).catch(function(error) {
  console.error(error);
});

function callPayment() {
    alert("Payment")
    Pi.createPayment({
        // Amount of π to be paid:
        amount: 3.14,
        // An explanation of the payment - will be shown to the user:
        memo: "Donate Pi", // e.g: "Digital kitten #1234",
        // An arbitrary developer-provided metadata object - for your own usage:
        metadata: { 
          kittenId: 
         }, // e.g: { kittenId: 1234 }
      }, {
        // Callbacks you need to implement - read more about those in the detailed docs linked below:
        onReadyForServerApproval: function(paymentId) { 
            alert(`onReadyForServerApproval paymentId: ${paymentId}`)
         },
        onReadyForServerCompletion: function(paymentId, txid) { 
            alert(`onReadyForServerCompletion paymentId: ${paymentId}, txId: ${txid}`)
         },
        onCancel: function(paymentId) { 
            alert(`onCancel paymentId: ${paymentId}`)
         },
        onError: function(error, payment) { 
            alert(`onCancel paymentId: ${payment}`)
         },
      });
}