import { findProductById } from './externalServices.mjs';
import { alertMessage, getLocalStorage, setLocalStorage } from './utils.mjs';

let data;

async function productDetails(productId) {
    data = await findProductById(productId);
    renderProductDetails();
    document.getElementById('addToCart').addEventListener('click', addToCart);
}

async function addToCart(e) {
    const product = await findProductById(e.target.dataset.id);
    const cartItems = getLocalStorage('so-cart') || [];

    cartItems.push(product);
    setLocalStorage('so-cart', cartItems);
    alertMessage('Item added to cart!', false);
}

function renderProductDetails() {
    document.title = `Sleep Outside | ${data.Name}`;
    document.getElementById('productName').textContent = data.Brand.Name;
    document.getElementById('productNameWithoutBrand').textContent = data.NameWithoutBrand;
    const image = document.getElementById('productImage');
    image.src = data.Image;
    image.alt = data.Name;
    document.getElementById('productFinalPrice').textContent = '$' + data.FinalPrice;
    document.getElementById('productColorName').textContent = data.Colors[0].ColorName;
    document.getElementById('productDescriptionHtmlSimple').innerHTML = data.DescriptionHtmlSimple;
}

export default productDetails;
