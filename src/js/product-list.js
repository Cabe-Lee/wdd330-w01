import ProductData from "./productData.mjs";
import ProductList from "./productList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category = getParam("category");

const dataSource = new ProductData();