const inputField = document.getElementById('coupon-input');
// const warning = document.getElementById('warning');

inputField.addEventListener('input', function() {

    // // Check if there are any disallowed characters
    // let originalValue = this.value;

    // // Allow only lowercase letters, numbers, and "-" signs
    // let filteredValue = originalValue.replace(/[^a-z0-9-]/g, '');

    // // Set the filtered value back to the input
    // this.value = filteredValue;

    // // If the original input is not the same as the filtered, show the warning
    // if (originalValue !== filteredValue) {
    //     warning.style.display = 'block';
    // } else {
    //     warning.style.display = 'none';

    // Convert uppercase letters to lowercase and filter other disallowed characters
    let originalValue = this.value;

    // Replace any disallowed characters and automatically convert uppercase letters to lowercase
    let filteredValue = originalValue.toLowerCase().replace(/[^a-z0-9-]/g, '');

    // Set the filtered value back to the input
    this.value = filteredValue;
    // }
});

function verifyCoupon() {
    const couponInput = document.getElementById('coupon-input');
    const couponCode = couponInput.value.trim();
    const resultDiv = document.getElementById('result');

    if (couponCode === '') {
      resultDiv.textContent = 'Please enter a coupon code.';
      return;
    }

    const userAddress = new URLSearchParams(window.location.search).get('user_address');

    if (!userAddress) {
      resultDiv.textContent = 'Unable to retrieve user address.';
      return;
    }
    resultDiv.textContent = 'Your request is being checked...\n if everything is alright you will receive the product in a few moments.';


    const url = 'https://us-central1-arnacon-nl.cloudfunctions.net/verify_coupon';
    const dataToSend = {
      coupon_code: couponCode,
      user_address: userAddress
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => {
      if (!response.ok) {
        // Handle HTTP errors here based on status code
        if (response.status === 409) {
            resultDiv.textContent = 'Coupon already verified.';
        } else if (response.status === 404) {
          resultDiv.textContent = 'Coupon not found.';
        } else if (response.status >= 400 && response.status < 500) {
          resultDiv.textContent = 'Client error: ' + response.status;
        }
    }
    return response.text(); // or response.json() depending on response type
    })
    .then(data => {
        resultDiv.textContent = 'Succcesfully verified coupon: ' + couponCode;
    //   if (data.valid) {
    //     resultDiv.textContent = 'Coupon is valid!';
    //   } else {
    //     resultDiv.textContent = 'Coupon is invalid.';
    //   }
    })
    .catch(error => {
      resultDiv.textContent = 'Error verifying coupon: ' + error.message;
    });
  }