import CheckoutProcess from './checkoutProcess.mjs';

const checkoutProcess = new CheckoutProcess('so-cart', '.checkout-form');
checkoutProcess.init();

document.querySelector('#checkoutSubmit').addEventListener('click', (event) => {
  event.preventDefault();

  const myForm = document.forms[0];
  const chk_status = myForm.checkValidity();

  myForm.reportValidity();

  if (chk_status) {
    checkoutProcess.checkout();
  }
});