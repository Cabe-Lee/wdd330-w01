import { getData } from './productData.mjs';
import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    return `
        <li class="product-card">
            <a href="product_pages/index.html?product=${product.Id}">
                <img
                    src="${product.Image}"
                    alt="Image of ${product.Name}"
                />
                <h3 class="card__brand">${product.Brand.Name}</h3>
                <h2 class="card__name">${product.NameWithoutBrand}</h2>
            <p class="product-card__price">$${product.FinalPrice}</p></a>
        </li>
    `;
}             

function filterProducts(products) {
    return products.filter((_, i) => i !== 2 && i !== 4);
}

async function productList(selector, category) {
    const element = document.querySelector(selector);
    const data = await getData(category);
    const list = filterProducts(data);
    renderListWithTemplate(productCardTemplate, element, list);
}

export default productList;
