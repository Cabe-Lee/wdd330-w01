import checkoutProcess from './checkoutProcess.mjs';

const checkoutForm = document.querySelector('.checkout-form');

checkoutProcess.init('so-cart', '.checkout-summary');

checkoutForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const isValid = checkoutForm.checkValidity();
  checkoutForm.reportValidity();

  if (isValid) {
    checkoutProcess.checkout(checkoutForm);
  }
});