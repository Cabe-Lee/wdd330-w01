async function loadPartial(selector, filePath) {
  const element = document.querySelector(selector);

  if (!element) {
    return;
  }

  try {
    const response = await fetch(filePath);

    if (!response.ok) {
      throw new Error(`Could not load ${filePath}`);
    }

    const html = await response.text();
    element.innerHTML = html;
  } catch {
    element.innerHTML = '';
  }
}

loadPartial('#main-header', '/partials/header.html');
loadPartial('#main-footer', '/partials/footer.html');