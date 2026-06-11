import { getProductsByCategory } from "./externalServices.mjs";
import { getProductImage, renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/index.html?product=${product.Id}">
    <img
      src="${getProductImage(product)}"
      alt="Image of ${product.Name}"
    />
    <h3 class="card__brand">${product.Brand.Name}</h3>
    <h2 class="card__name">${product.NameWithoutBrand}</h2>
    <p class="product-card__price">$${product.FinalPrice}</p></a>
  </li>`;
}

export default async function productList(selector, category) {
  const el = document.querySelector(selector);
  const products = await getProductsByCategory(category);
  renderListWithTemplate(productCardTemplate, el, products);
  document.querySelector(".title").textContent = formatCategory(category);
}

function formatCategory(category) {
  return category
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
