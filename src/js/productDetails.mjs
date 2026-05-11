import { findProductById } from "./productData.mjs";
import { setLocalStorage } from "./utils.mjs";

let product = {};

function renderProductDetails(product) {
  document.title = `Sleep Outside | ${product.Name}`;
  document.querySelector("#productName").textContent = product.Brand.Name;
  document.querySelector("#productNameWithoutBrand").textContent =
    product.NameWithoutBrand;
  document.querySelector("#productImage").src = product.Image;
  document.querySelector("#productImage").alt = product.Name;
  document.querySelector("#productFinalPrice").textContent =
    `$${product.FinalPrice}`;
  document.querySelector("#productColorName").textContent =
    product.Colors[0].ColorName;
  document.querySelector("#productDescriptionHtmlSimple").innerHTML =
    product.DescriptionHtmlSimple;

  document.querySelector("#addToCart").dataset.id = product.Id;
}

function addToCart() {
  setLocalStorage("so-cart", product);
}

export default async function productDetails(productId) {
  product = await findProductById(productId);

  renderProductDetails(product);

  document.querySelector("#addToCart").addEventListener("click", addToCart);
}
