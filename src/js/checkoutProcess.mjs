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

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};

  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });

  return convertedJSON;
}

function packageItems(items) {
  const packagedItems = items.reduce((groupedItems, item) => {
    const existingItem = groupedItems[item.Id];

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      groupedItems[item.Id] = {
        id: item.Id,
        name: item.Name,
        price: Number(item.FinalPrice),
        quantity: 1,
      };
    }

    return groupedItems;
  }, {});

  return Object.values(packagedItems);
}

const checkoutProcess = {
  key: '',
  outputSelector: '',
  list: [],
  itemTotal: 0,
  shipping: 0,
  tax: 0,
  orderTotal: 0,
  init(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = getLocalStorage(key) || [];
    this.form = document.querySelector('.checkout-form');
    this.summaryElement = document.querySelector(outputSelector);
    this.calculateItemSummary();

    const zipInput = this.form?.elements.namedItem('zip');
    if (zipInput) {
      zipInput.addEventListener('blur', () => {
        if (zipInput.checkValidity()) {
          this.calculateOrdertotal();
        }
      });
    }
  },
  calculateItemSummary() {
    this.itemTotal = this.list.reduce(
      (total, item) => total + Number(item.FinalPrice || 0),
      0
    );

    this.summaryElement.querySelector('#itemCount').textContent = String(
      this.list.length
    );
    this.summaryElement.querySelector('#subtotal').textContent = formatCurrency(
      this.itemTotal
    );
    this.displayOrderTotals();
  },
  calculateOrdertotal() {
    const itemCount = this.list.length;

    this.shipping = itemCount > 0 ? 10 + Math.max(0, itemCount - 1) * 2 : 0;
    this.tax = this.itemTotal * 0.06;
    this.orderTotal = this.itemTotal + this.shipping + this.tax;

    this.displayOrderTotals();
  },
  displayOrderTotals() {
    this.summaryElement.querySelector('#shipping').textContent = formatCurrency(
      this.shipping
    );
    this.summaryElement.querySelector('#tax').textContent = formatCurrency(this.tax);
    this.summaryElement.querySelector('#orderTotal').textContent = formatCurrency(
      this.orderTotal || this.itemTotal
    );
  },
  async checkout(form) {
    if (this.list.length === 0) {
      alertMessage('Your cart is empty. Add an item before checking out.');
      return;
    }

    this.calculateOrdertotal();

    const formData = formDataToJSON(form);
    const order = {
      orderDate: new Date().toISOString(),
      fname: formData.fname,
      lname: formData.lname,
      street: formData.street,
      city: formData.city,
      state: formData.state,
      zip: formData.zip,
      cardNumber: formData.cardNumber,
      expiration: formData.expiration,
      code: formData.code,
      items: packageItems(this.list),
      orderTotal: this.orderTotal.toFixed(2),
      shipping: this.shipping,
      tax: this.tax.toFixed(2),
    };

    try {
      await checkout(order);
      localStorage.removeItem(this.key);
      window.location.href = '/checkout/success.html';
    } catch (err) {
      console.log(err);

      if (err.name === 'servicesError') {
        alertMessage(extractServerMessage(err.message));
      } else {
        alertMessage(err.message || 'Something went wrong. Please try again.');
      }
    }
  },
};

export default checkoutProcess;