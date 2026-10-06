//Inspiration to cart functionality from this article:
//https://dev.to/pillagerplayz/how-to-create-a-simple-shopping-cart-in-html5-css3-and-js-with-payment-integration-4cel

//AI help with troubleshooting
//https://grok.com/share/c2hhcmQtMw_d91f1188-7b49-4595-8197-c7540db0934b

// Load cart from localStorage or initialize empty one
let cart = JSON.parse(localStorage.getItem("cart")) || [];

//Initialize cart count on page load and render cart if on cart page
document.addEventListener("DOMContentLoaded", function () {
  updateCartCount();

  // Check if we are on the cart page to render items
  if (document.getElementById("cart-items")) {
    renderCart();
  }

  // Setup "Add to Cart" buttons
  const addButtons = document.querySelectorAll(".add-to-cart");
  addButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const product = {
        id: this.dataset.id,
        name: this.dataset.name,
        price: parseFloat(this.dataset.price),
        img: this.dataset.img,
      };
      addToCart(product);
    });
  });

  // Setup Clear Cart button
  const clearBtn = document.getElementById("clear-cart");
  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      if (confirm("Empty cart?")) {
        cart = [];
        saveAndRefresh();
      }
    });
  }
});

//Add to cart function, checks if item already exists and increases quantity, otherwise adds new item
function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveAndRefresh();
}
//save cart to localStorage and update display
function saveAndRefresh() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  if (document.getElementById("cart-items")) {
    renderCart();
  }
}
//update cart count in header
function updateCartCount() {
  const countEl = document.getElementById("cart-count");
  if (countEl) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countEl.textContent = totalItems;
  }
}

function renderCart() {
  const cartItemsDiv = document.getElementById("cart-items");
  const cartTotalSpan = document.getElementById("cart-total");
  const emptyMessage = document.getElementById("empty-message");

  if (!cartItemsDiv) return;

  // Clear current display
  cartItemsDiv.innerHTML = "";

  // If cart is empty, show message and reset total
  if (cart.length === 0) {
    emptyMessage.style.display = "block";
    cartTotalSpan.textContent = "0";
    return;
  }

  emptyMessage.style.display = "none";
  let total = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal; // Calculate total

    const itemDiv = document.createElement("div");
    itemDiv.classList.add("cart-item");

    //Create HTML structure for each cart item, including image, name, price, quantity, total price, and remove button
    itemDiv.innerHTML = `
      <img src="${item.img.startsWith("Img/") ? (document.body.dataset.root || "") + item.img : item.img}" width="50">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>${item.price} SEK × ${item.quantity}</p>
        <p class="cart-item-total">${itemTotal} SEK</p>
      </div>
      <button class="remove-btn" style="margin-bottom: 70px;" onclick="removeFromCart(${index})">Remove</button>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });

  cartTotalSpan.textContent = total;
}

//Remove item from cart, then save and refresh
window.removeFromCart = function (index) {
  const removedItem = cart[index].name;
  cart.splice(index, 1);
  saveAndRefresh();
};
