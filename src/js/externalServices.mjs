const baseURL = import.meta.env.VITE_SERVER_URL;
const localCategories = ["tents", "backpacks", "sleeping-bags"];

async function convertToJson(res) {
  const data = await res.json();
  if (res.ok) {
    return data;
  } else {
    throw { name: "servicesError", message: data };
  }
}

async function getLocalCategoryData(category) {
  const response = await fetch(`/json/${category}.json`);
  if (!response.ok) {
    throw { name: "servicesError", message: { error: "Local data unavailable" } };
  }
  return response.json();
}

export async function getProductsByCategory(category) {
  if (localCategories.includes(category)) {
    return getLocalCategoryData(category);
  }

  try {
    const response = await fetch(baseURL + `products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  } catch (error) {
    return getLocalCategoryData(category);
  }
}

export async function findProductById(id) {
  for (const category of localCategories) {
    const products = await getLocalCategoryData(category);
    const match = products.find((item) => item.Id === id);
    if (match) {
      return match;
    }
  }

  try {
    const response = await fetch(baseURL + `product/${id}`);
    const product = await convertToJson(response);
    return product.Result;
  } catch (error) {
    throw error;
  }
}

export async function checkout(payload) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  };
  return await fetch(baseURL + "checkout/", options).then(convertToJson);
}