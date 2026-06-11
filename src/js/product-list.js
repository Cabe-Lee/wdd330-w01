import productList from './productLists.mjs';
import { getParam } from './utils.mjs';

const category = getParam('category') || 'tents';

productList('.product-list', category);