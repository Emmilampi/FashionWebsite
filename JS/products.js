// Renders product listings and the product detail page from PRODUCTS.
// Each HTML page sets <body data-root="../"> (or "" for index) so image
// and link paths work from any folder depth.

const ROOT = document.body.dataset.root || "";

function productCard(p) {
  return `
    <figure>
      <a href="${ROOT}HTML/product.html?id=${p.id}">
        <img src="${ROOT}${p.img}" alt="${p.name}" />
      </a>
      <h3>${p.name}</h3>
      <p>${p.price} SEK</p>
    </figure>`;
}

// Listing pages: <section id="product-grid" data-category="outwear"></section>
// Use data-category="all" (or omit it) for Shop All.
function renderGrid() {
  const grid = document.getElementById("product-grid");
  if (!grid) return;
  const category = grid.dataset.category || "all";
  const items = PRODUCTS.filter((p) => category === "all" || p.category === category);
  grid.innerHTML = items.map(productCard).join("");
}

// Detail page: product.html?id=blackpant
function renderDetail() {
  const container = document.getElementById("product-detail");
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get("id");
  const p = PRODUCTS.find((item) => item.id === id);

  if (!p) {
    container.innerHTML = `<p>Product not found. <a href="products.html">Back to Shop All</a></p>`;
    return;
  }

  document.title = `${p.name} | Cold Days`;
  container.innerHTML = `
    <div class="productdetailimg">
      <img src="${ROOT}${p.img}" alt="${p.name}" />
    </div>
    <div class="productdetailtext">
      <h2>${p.name}</h2>
      <h4>${p.description}</h4>
      <p>Material: ${p.material}</p>
      <p>${p.price} SEK</p>
      <button class="add-to-cart" id="add-btn">Add to Cart</button>
    </div>`;

  // addToCart() comes from script.js. We attach the listener here because
  // the button only exists after this render.
  document.getElementById("add-btn").addEventListener("click", () => {
    addToCart({ id: p.id, name: p.name, price: p.price, img: p.img });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  renderDetail();
});
