import { checkout } from './externalServices.mjs';
import { alertMessage, getLocalStorage } from './utils.mjs';

function formatCurrency(value) {
  return `$${value.toFixed(2)}`;
}

function extractServerMessage(message) {
  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message)) {
    return message.join(', ');
  }

  if (message && typeof message === 'object') {
    if (typeof message.message === 'string') {
      return message.message;
    }

    const firstValue = Object.values(message).find(
      (value) => typeof value === 'string'
    );

    if (firstValue) {
      return firstValue;
    }
  }

  return 'There was a problem with your order. Please check your information and try again.';
}

export default class CheckoutProcess {
  constructor(key, formSelector) {
    this.key = key;
    this.form = document.querySelector(formSelector);
    this.cartItems = getLocalStorage(this.key) || [];
    this.shipping = this.cartItems.length > 0 ? 10 : 0;
    this.taxRate = 0.06;
  }

  init() {
    this.renderOrderSummary();
  }

  calculateSubtotal() {
    return this.cartItems.reduce(
      (total, item) => total + Number(item.FinalPrice || 0),
      0
    );
  }

  calculateTax() {
    return this.calculateSubtotal() * this.taxRate;
  }

  calculateOrdertotal() {
    return this.calculateSubtotal() + this.shipping + this.calculateTax();
  }

  renderOrderSummary() {
    document.getElementById('itemCount').textContent = String(this.cartItems.length);
    document.getElementById('subtotal').textContent = formatCurrency(
      this.calculateSubtotal()
    );
    document.getElementById('shipping').textContent = formatCurrency(this.shipping);
    document.getElementById('tax').textContent = formatCurrency(this.calculateTax());
    document.getElementById('orderTotal').textContent = formatCurrency(
      this.calculateOrdertotal()
    );
  }

  packageItems() {
    if (this.cartItems.length === 0) {
      throw new Error('Your cart is empty. Add an item before checking out.');
    }

    const formData = new FormData(this.form);
    const order = Object.fromEntries(formData.entries());

    return {
      ...order,
      items: this.cartItems,
      orderDate: new Date().toISOString(),
      tax: this.calculateTax(),
      shipping: this.shipping,
      orderTotal: this.calculateOrdertotal(),
    };
  }

  async checkout() {
    try {
      const order = this.packageItems();
      await checkout(order);

      localStorage.removeItem('so-cart');
      window.location.href = '/checkout/success.html';
    } catch (err) {
      console.log(err);

      if (err.name === 'servicesError') {
        alertMessage(extractServerMessage(err.message));
      } else {
        alertMessage(err.message || 'Something went wrong. Please try again.');
      }
    }
  }
}