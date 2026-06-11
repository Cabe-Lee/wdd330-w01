const serverURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  const jsonResponse = await res.json();

  if (res.ok) {
    return jsonResponse;
  } else {
    throw {
      name: 'servicesError',
      message: jsonResponse,
    };
  }
}

export function getProductsByCategory(category = 'tents') {
  return fetch(`/json/${category}.json`)
    .then(convertToJson)
    .then((data) => data);
}

export async function findProductById(id, category = 'tents') {
  const products = await getProductsByCategory(category);
  return products.find((item) => item.Id === id);
}

export async function checkout(order) {
  const response = await fetch(`${serverURL}checkout/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(order),
  });

  return convertToJson(response);
}