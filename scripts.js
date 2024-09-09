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

    fetch('https://us-central1-arnacon-nl.cloudfunctions.net/verify_coupon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'user_address': userAddress
      },
      body: JSON.stringify({ coupon_code: couponCode })
    })
    .then(response => response.json())
    .then(data => {
      if (data.valid) {
        resultDiv.textContent = 'Coupon is valid!';
      } else {
        resultDiv.textContent = 'Coupon is invalid.';
      }
    })
    .catch(error => {
      resultDiv.textContent = 'Error verifying coupon: ' + error.message;
    });
  }