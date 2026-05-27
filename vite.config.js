import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: "src/index.html",
        productList: "src/product-list/index.html",
        productDetail: "src/product_pages/index.html",
        cart: "src/cart/index.html",
        checkout: "src/checkout/index.html",
      },
    },
  },
});
