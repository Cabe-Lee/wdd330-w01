import { findProductById } from './productData.mjs';
import { setLocalStorage } from './utils.mjs';

let data;

async function productDetails(productId) {
    data = await findProductById(productId);
    renderProductDetails();
    document.getElementById('addToCart').addEventListener('click', addToCart);
}

async function addToCart(e) {
    const product = findProductById(e.target.dataset.id);
    setLocalStorage('so-cart', product);
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
