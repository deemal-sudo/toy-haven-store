/* ==========================================================================
   Toy Haven — main.js
   Shared logic for every page: header/footer rendering, cart + wishlist
   storage, toast notifications, and per-page setup. One file, loaded on
   every page, dispatches to the right setup function based on what markup
   is present.
   ========================================================================== */

/* --------------------------------------------------------------------
   Storage keys & generic helpers (reused on every page)
   -------------------------------------------------------------------- */
const STORAGE_KEYS = {
  cart: "toyhaven_cart",
  wishlist: "toyhaven_wishlist",
  newsletter: "toyhaven_newsletter",
  orders: "toyhaven_orders",
  feedback: "toyhaven_feedback"
};

/** Reusable function #1 — safe localStorage read, used across every page. */
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn("Toy Haven: could not read", key, err);
    return fallback;
  }
}

/** Reusable function #2 — safe localStorage write, used across every page. */
function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.warn("Toy Haven: could not save", key, err);
    return false;
  }
}

/** Reusable function #3 — currency formatting, used across every page. */
function formatPrice(amount) {
  return "$" + Number(amount).toFixed(2);
}

/** Reusable function #4 — basic email shape check, used on two forms. */
function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function findProduct(id) {
  return TOY_HAVEN_PRODUCTS.find((p) => p.id === id);
}

/* --------------------------------------------------------------------
   Cart helpers
   -------------------------------------------------------------------- */
function getCart() {
  return readStore(STORAGE_KEYS.cart, []); // [{id, qty}]
}

function saveCart(cart) {
  writeStore(STORAGE_KEYS.cart, cart);
  updateHeaderBadges();
}

function addToCart(id, qty) {
  qty = qty || 1;
  const cart = getCart();
  const line = cart.find((item) => item.id === id);
  if (line) {
    line.qty += qty;
  } else {
    cart.push({ id: id, qty: qty });
  }
  saveCart(cart);
  const product = findProduct(id);
  showToast((product ? product.name : "Item") + " added to your cart", "success");
}

function removeFromCart(id) {
  const cart = getCart().filter((item) => item.id !== id);
  saveCart(cart);
}

function changeCartQty(id, delta) {
  const cart = getCart();
  const line = cart.find((item) => item.id === id);
  if (!line) return;
  line.qty += delta;
  if (line.qty < 1) {
    removeFromCart(id);
    renderCartPage();
    return;
  }
  saveCart(cart);
  renderCartPage();
}

function cartCount() {
  return getCart().reduce((sum, item) => sum + item.qty, 0);
}

function cartSubtotal() {
  return getCart().reduce((sum, item) => {
    const product = findProduct(item.id);
    return product ? sum + product.price * item.qty : sum;
  }, 0);
}

/* --------------------------------------------------------------------
   Wishlist helpers — status is one of "interested" | "owned" | "not-interested"
   -------------------------------------------------------------------- */
function getWishlist() {
  return readStore(STORAGE_KEYS.wishlist, {}); // { productId: status }
}

function saveWishlist(list) {
  writeStore(STORAGE_KEYS.wishlist, list);
  updateHeaderBadges();
}

function isWishlisted(id) {
  return Object.prototype.hasOwnProperty.call(getWishlist(), id);
}

function toggleWishlist(id) {
  const list = getWishlist();
  if (list[id]) {
    delete list[id];
    showToast("Removed from your wishlist", "info");
  } else {
    list[id] = "interested";
    showToast("Saved to your wishlist", "success");
  }
  saveWishlist(list);
  return Object.prototype.hasOwnProperty.call(list, id);
}

function setWishlistStatus(id, status) {
  const list = getWishlist();
  if (!list[id]) return;
  list[id] = status;
  saveWishlist(list);
}

function wishlistCount() {
  return Object.keys(getWishlist()).length;
}

/* --------------------------------------------------------------------
   Toast notifications (reusable across every page)
   -------------------------------------------------------------------- */
function showToast(message, kind) {
  let host = document.getElementById("th-toast-host");
  if (!host) {
    host = document.createElement("div");
    host.id = "th-toast-host";
    host.className = "toast-host";
    document.body.appendChild(host);
  }
  const toast = document.createElement("div");
  toast.className = "toast toast--" + (kind || "info");
  toast.setAttribute("role", "status");
  toast.textContent = message;
  host.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("toast--visible"));

  setTimeout(() => {
    toast.classList.remove("toast--visible");
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}

/* --------------------------------------------------------------------
   Header + footer — injected on every page so markup lives in one place
   -------------------------------------------------------------------- */
function renderHeader() {
  const mount = document.getElementById("site-header");
  if (!mount) return;

  const current = document.body.getAttribute("data-page");
  const nav = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "products.html", label: "Shop", key: "shop" },
    { href: "cart.html", label: "Cart", key: "cart" },
    { href: "wishlist.html", label: "Wishlist", key: "wishlist" },
    { href: "support.html", label: "Support", key: "support" }
  ];

  const navHtml = nav
    .map(
      (item) =>
        `<a href="${item.href}" class="nav-link${item.key === current ? " nav-link--active" : ""}">${item.label}</a>`
    )
    .join("");

  mount.innerHTML = `
    <div class="header-inner">
      <a href="index.html" class="brand">
        <span class="brand-mark" aria-hidden="true">TH</span>
        <span class="brand-name">Toy Haven</span>
      </a>

      <nav class="site-nav" id="site-nav" aria-label="Primary">
        ${navHtml}
      </nav>

      <div class="header-actions">
        <form class="header-search" id="header-search-form" role="search">
          <label class="visually-hidden" for="header-search-input">Search products</label>
          <input type="search" id="header-search-input" placeholder="Search figurines, toys, games...">
          <button type="submit" aria-label="Search">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          </button>
        </form>

        <a href="wishlist.html" class="icon-btn" aria-label="Wishlist">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.4 5 6 5c2 0 3.4 1 4 2.4C10.6 6 12 5 14 5c3.6 0 5.5 3.4 4 6.9C19.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.8"/></svg>
          <span class="icon-badge" id="wishlist-badge">0</span>
        </a>
        <a href="cart.html" class="icon-btn" aria-label="Cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 4h2l2.4 12.2a2 2 0 0 0 2 1.6h7.2a2 2 0 0 0 2-1.6L20 8H6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="9.5" cy="21" r="1.4" fill="currentColor"/><circle cx="17.5" cy="21" r="1.4" fill="currentColor"/></svg>
          <span class="icon-badge" id="cart-badge">0</span>
        </a>

        <button class="hamburger" id="hamburger-btn" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  `;

  const hamburger = document.getElementById("hamburger-btn");
  const siteNav = document.getElementById("site-nav");
  hamburger.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("site-nav--open");
    hamburger.classList.toggle("hamburger--open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  });

  const searchForm = document.getElementById("header-search-form");
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = document.getElementById("header-search-input").value.trim();
    window.location.href = "products.html" + (query ? "?q=" + encodeURIComponent(query) : "");
  });

  updateHeaderBadges();
}

function updateHeaderBadges() {
  const cartBadge = document.getElementById("cart-badge");
  const wishlistBadge = document.getElementById("wishlist-badge");
  if (cartBadge) cartBadge.textContent = String(cartCount());
  if (wishlistBadge) wishlistBadge.textContent = String(wishlistCount());
}

function renderFooter() {
  const mount = document.getElementById("site-footer");
  if (!mount) return;

  mount.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <a href="index.html" class="brand">
          <span class="brand-mark" aria-hidden="true">TH</span>
          <span class="brand-name">Toy Haven</span>
        </a>
        <p>A shelf-worthy home for figurines, toys, board games and diecast cars, built for people who love the hunt as much as the collection.</p>
        <div class="social-row">
          <a href="#" aria-label="Facebook" class="social-btn">f</a>
          <a href="#" aria-label="Instagram" class="social-btn">ig</a>
          <a href="#" aria-label="YouTube" class="social-btn">yt</a>
        </div>
      </div>

      <div class="footer-col">
        <h3>Explore</h3>
        <ul>
          <li><a href="products.html">New Arrivals</a></li>
          <li><a href="wishlist.html">Your Collection</a></li>
          <li><a href="cart.html">Your Cart</a></li>
        </ul>
      </div>

      <div class="footer-col">
        <h3>Support</h3>
        <ul>
          <li><a href="support.html">Help Center</a></li>
          <li><a href="checkout.html">Checkout</a></li>
          <li><a href="support.html">Track an Order</a></li>
        </ul>
      </div>

      <div class="footer-col footer-newsletter">
        <h3>Toy Haven Dispatch</h3>
        <p>Get first access to new drops and restocks.</p>
        <form id="newsletter-form" novalidate>
          <input type="email" id="newsletter-email" placeholder="Enter your email" aria-label="Email address">
          <button type="submit">Subscribe</button>
        </form>
        <p class="form-error" id="newsletter-error" hidden></p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Toy Haven. Made for collectors, by collectors.</p>
      <div class="footer-legal">
        <a href="#">Privacy</a>
        <a href="#">Terms</a>
        <a href="#">Cookies</a>
      </div>
    </div>
  `;

  const form = document.getElementById("newsletter-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("newsletter-email");
    const error = document.getElementById("newsletter-error");
    if (!isValidEmail(input.value)) {
      error.textContent = "Enter a valid email address to subscribe.";
      error.hidden = false;
      input.focus();
      return;
    }
    error.hidden = true;
    const list = readStore(STORAGE_KEYS.newsletter, []);
    if (!list.includes(input.value.trim())) {
      list.push(input.value.trim());
      writeStore(STORAGE_KEYS.newsletter, list);
    }
    input.value = "";
    showToast("You're on the list! Watch your inbox for drops.", "success");
  });
}

/* --------------------------------------------------------------------
   Scroll-reveal (shared): fades sections in as they enter the viewport
   -------------------------------------------------------------------- */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   HOME PAGE
   ========================================================================== */
function initHomePage() {
  const heroMount = document.getElementById("hero-slider");
  if (!heroMount) return;

  let activeSlide = 0;
  let rotateTimer = null;

  function renderHero() {
    const slide = TOY_HAVEN_HERO_SLIDES[activeSlide];
        heroMount.innerHTML = `
      <div class="hero-slide" data-cat="${slide.category}">
        <div class="hero-slide-text">
          <span class="hero-eyebrow">${slide.eyebrow}</span>
          <h1>${slide.title}</h1>
          <p>${slide.copy}</p>
          <a class="btn btn--primary" href="products.html?category=${encodeURIComponent(slide.category)}">${slide.cta}</a>
        </div>
        <div class="hero-slide-media">
          <img src="${slide.image}" alt="" style="object-position:${slide.position || "center"}">
        </div>
      </div>
      <div class="hero-dots" role="tablist" aria-label="Promotional banners">
        ${TOY_HAVEN_HERO_SLIDES.map((_, i) => `<button class="hero-dot${i === activeSlide ? " hero-dot--active" : ""}" role="tab" aria-selected="${i === activeSlide}" aria-label="Slide ${i + 1}" data-index="${i}"></button>`).join("")}
      </div>
    `;
    heroMount.querySelectorAll(".hero-dot").forEach((dot) => {
      dot.addEventListener("click", () => {
        activeSlide = Number(dot.getAttribute("data-index"));
        restartRotation();
      });
    });
  }

  function restartRotation() {
    renderHero();
    clearInterval(rotateTimer);
    rotateTimer = setInterval(() => {
      activeSlide = (activeSlide + 1) % TOY_HAVEN_HERO_SLIDES.length;
      renderHero();
    }, 5000);
  }

  restartRotation();

  const featuredMount = document.getElementById("featured-grid");
  if (featuredMount) {
    const featuredIds = ["fig-001", "dc-001", "bg-001", "toy-001"];
    featuredMount.innerHTML = featuredIds.map((id) => productCardHtml(findProduct(id))).join("");
    attachProductCardEvents(featuredMount);
  }
}

/* ==========================================================================
   Product card markup (shared by home + products + wishlist pages)
   ========================================================================== */
function productCardHtml(product) {
  if (!product) return "";
  const meta = TOY_HAVEN_CATEGORIES[product.category] || {};
  const wished = isWishlisted(product.id);
  return `
    <article class="product-card" data-id="${product.id}" data-reveal>
      <div class="product-media" style="--cat-color:${meta.color || "var(--color-primary)"}">
        <img class="product-media-img" src="${product.image}" alt="" loading="lazy" style="object-position:${product.imagePosition || "center"}">
        <button class="wish-toggle${wished ? " wish-toggle--active" : ""}" data-action="toggle-wish" aria-label="Toggle wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="${wished ? "currentColor" : "none"}"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.4 5 6 5c2 0 3.4 1 4 2.4C10.6 6 12 5 14 5c3.6 0 5.5 3.4 4 6.9C19.5 16.4 12 21 12 21z" stroke="currentColor" stroke-width="1.8"/></svg>
        </button>
        ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ""}
      </div>
      <div class="product-body">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-variant">${product.variant}</p>
        <div class="product-footer">
          <span class="product-price">${formatPrice(product.price)}</span>
        </div>
        <button class="btn btn--primary btn--block" data-action="add-cart">Add to Cart</button>
      </div>
    </article>
  `;
}

function attachProductCardEvents(scope) {
  scope.querySelectorAll(".product-card").forEach((card) => {
    const id = card.getAttribute("data-id");
    const wishBtn = card.querySelector('[data-action="toggle-wish"]');
    const cartBtn = card.querySelector('[data-action="add-cart"]');
    if (wishBtn) {
      wishBtn.addEventListener("click", () => {
        const active = toggleWishlist(id);
        wishBtn.classList.toggle("wish-toggle--active", active);
        wishBtn.querySelector("svg").setAttribute("fill", active ? "currentColor" : "none");
      });
    }
    if (cartBtn) {
      cartBtn.addEventListener("click", () => addToCart(id, 1));
    }
  });
}

/* ==========================================================================
   PRODUCTS / SHOP PAGE
   ========================================================================== */
function initProductsPage() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;

  const params = new URLSearchParams(window.location.search);
  const state = {
    query: params.get("q") || "",
    categories: params.get("category") ? [params.get("category")] : [],
    minPrice: null,
    maxPrice: null,
    page: 1,
    perPage: 6
  };

  const searchInput = document.getElementById("filter-search");
  const minInput = document.getElementById("filter-min");
  const maxInput = document.getElementById("filter-max");
  const clearBtn = document.getElementById("filter-clear");
  const countLabel = document.getElementById("results-count");
  const pager = document.getElementById("pagination");
  const categoryInputs = document.querySelectorAll(".filter-category");

  searchInput.value = state.query;
  categoryInputs.forEach((box) => {
    box.checked = state.categories.includes(box.value);
  });

  function getFiltered() {
    return TOY_HAVEN_PRODUCTS.filter((product) => {
      const matchesQuery = product.name.toLowerCase().includes(state.query.trim().toLowerCase());
      const activeCats = Array.from(categoryInputs).filter((c) => c.checked).map((c) => c.value);
      const matchesCategory = activeCats.length === 0 || activeCats.includes(product.category);
      const matchesMin = state.minPrice === null || product.price >= state.minPrice;
      const matchesMax = state.maxPrice === null || product.price <= state.maxPrice;
      return matchesQuery && matchesCategory && matchesMin && matchesMax;
    });
  }

  function render() {
    const filtered = getFiltered();
    const totalPages = Math.max(1, Math.ceil(filtered.length / state.perPage));
    state.page = Math.min(state.page, totalPages);
    const start = (state.page - 1) * state.perPage;
    const pageItems = filtered.slice(start, start + state.perPage);

    countLabel.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} matched`;

    grid.innerHTML = pageItems.length
      ? pageItems.map(productCardHtml).join("")
      : `<p class="empty-state">No products match those filters yet. Try widening your search.</p>`;
    attachProductCardEvents(grid);
    initScrollReveal();

    pager.innerHTML = "";
    if (totalPages > 1) {
      const makeBtn = (label, page, disabled, active) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "page-btn" + (active ? " page-btn--active" : "");
        btn.disabled = !!disabled;
        btn.addEventListener("click", () => {
          state.page = page;
          render();
          grid.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        return btn;
      };
      pager.appendChild(makeBtn("Prev", state.page - 1, state.page === 1));
      for (let i = 1; i <= totalPages; i++) {
        pager.appendChild(makeBtn(String(i), i, false, i === state.page));
      }
      pager.appendChild(makeBtn("Next", state.page + 1, state.page === totalPages));
    }
  }

  searchInput.addEventListener("input", () => {
    state.query = searchInput.value;
    state.page = 1;
    render();
  });
  categoryInputs.forEach((box) =>
    box.addEventListener("change", () => {
      state.page = 1;
      render();
    })
  );
  minInput.addEventListener("input", () => {
    state.minPrice = minInput.value ? Number(minInput.value) : null;
    state.page = 1;
    render();
  });
  maxInput.addEventListener("input", () => {
    state.maxPrice = maxInput.value ? Number(maxInput.value) : null;
    state.page = 1;
    render();
  });
  clearBtn.addEventListener("click", () => {
    state.query = "";
    state.minPrice = null;
    state.maxPrice = null;
    state.page = 1;
    searchInput.value = "";
    minInput.value = "";
    maxInput.value = "";
    categoryInputs.forEach((box) => (box.checked = false));
    render();
  });

  render();
}

/* ==========================================================================
   CART PAGE
   ========================================================================== */
function renderCartPage() {
  const mount = document.getElementById("cart-lines");
  if (!mount) return;
  const cart = getCart();

  if (!cart.length) {
    mount.innerHTML = `<p class="empty-state">Your cart is empty. <a href="products.html">Browse the shop</a> to find something worth collecting.</p>`;
  } else {
    mount.innerHTML = `
      <table class="cart-table">
        <thead>
          <tr><th>Product</th><th>Quantity</th><th>Price</th><th>Subtotal</th><th></th></tr>
        </thead>
        <tbody>
          ${cart
            .map((item) => {
              const product = findProduct(item.id);
              if (!product) return "";
              return `
              <tr data-id="${product.id}">
                <td class="cart-product-cell">
                  <img class="cart-thumb" style="--cat-color:${(TOY_HAVEN_CATEGORIES[product.category] || {}).color || "var(--color-primary)"}" src="${product.image}" alt="" style="object-position:${product.imagePosition || "center"}">
                  <span>
                    <strong>${product.name}</strong>
                    <small>${product.category}</small>
                  </span>
                </td>
                <td>
                  <div class="qty-control">
                    <button data-action="dec" aria-label="Decrease quantity">&minus;</button>
                    <span>${item.qty}</span>
                    <button data-action="inc" aria-label="Increase quantity">&plus;</button>
                  </div>
                </td>
                <td>${formatPrice(product.price)}</td>
                <td>${formatPrice(product.price * item.qty)}</td>
                <td><button class="remove-btn" data-action="remove" aria-label="Remove item">&times;</button></td>
              </tr>
            `;
            })
            .join("")}
        </tbody>
      </table>
    `;

    mount.querySelectorAll("tr[data-id]").forEach((row) => {
      const id = row.getAttribute("data-id");
      row.querySelector('[data-action="inc"]').addEventListener("click", () => changeCartQty(id, 1));
      row.querySelector('[data-action="dec"]').addEventListener("click", () => changeCartQty(id, -1));
      row.querySelector('[data-action="remove"]').addEventListener("click", () => {
        removeFromCart(id);
        renderCartPage();
      });
    });
  }

  const subtotal = cartSubtotal();
  const shipping = cart.length ? 15 : 0;
  document.getElementById("cart-subtotal").textContent = formatPrice(subtotal);
  document.getElementById("cart-shipping").textContent = formatPrice(shipping);
  document.getElementById("cart-total").textContent = formatPrice(subtotal + shipping);

  const checkoutBtn = document.getElementById("cart-checkout-btn");
  if (checkoutBtn) checkoutBtn.disabled = cart.length === 0;
}

function initCartPage() {
  const clearBtn = document.getElementById("cart-clear-btn");
  if (!clearBtn) return;
  clearBtn.addEventListener("click", () => {
    saveCart([]);
    renderCartPage();
    showToast("Cart cleared", "info");
  });
  const checkoutBtn = document.getElementById("cart-checkout-btn");
  checkoutBtn.addEventListener("click", () => {
    window.location.href = "checkout.html";
  });
  renderCartPage();
}

/* ==========================================================================
   CHECKOUT PAGE
   ========================================================================== */
function initCheckoutPage() {
  const form = document.getElementById("checkout-form");
  if (!form) return;

  const cart = getCart();
  const summary = document.getElementById("checkout-summary");
  const subtotal = cartSubtotal();
  const shipping = cart.length ? 15 : 0;
  const total = subtotal + shipping;

  if (!cart.length) {
    summary.innerHTML = `<p class="empty-state">Your cart is empty. <a href="products.html">Add something first</a>.</p>`;
    form.querySelector("button[type=submit]").disabled = true;
  } else {
    summary.innerHTML = `
      <ul class="checkout-list">
        ${cart
          .map((item) => {
            const product = findProduct(item.id);
            return product
              ? `<li><span>${item.qty}&times; ${product.name}</span><span>${formatPrice(product.price * item.qty)}</span></li>`
              : "";
          })
          .join("")}
      </ul>
      <div class="checkout-totals">
        <div><span>Subtotal</span><span>${formatPrice(subtotal)}</span></div>
        <div><span>Shipping</span><span>${formatPrice(shipping)}</span></div>
        <div class="checkout-grand"><span>Total</span><span>${formatPrice(total)}</span></div>
      </div>
    `;
  }

  const paymentRadios = form.querySelectorAll('input[name="payment"]');
  const cardFields = document.getElementById("card-fields");
  paymentRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      cardFields.hidden = radio.value !== "card" || !radio.checked;
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cart.length) return;

    const fields = {
      name: form.elements["fullName"],
      email: form.elements["email"],
      address: form.elements["address"],
      cardNumber: form.elements["cardNumber"]
    };
    const paymentMethod = form.querySelector('input[name="payment"]:checked').value;

    let firstInvalid = null;
    const errors = {};

    if (!fields.name.value.trim()) errors.name = "Enter the name on the order.";
    if (!isValidEmail(fields.email.value)) errors.email = "Enter a valid email address.";
    if (!fields.address.value.trim()) errors.address = "Enter a delivery address.";
    if (paymentMethod === "card" && fields.cardNumber.value.replace(/\s/g, "").length < 12) {
      errors.cardNumber = "Enter a valid card number.";
    }

    ["name", "email", "address", "cardNumber"].forEach((key) => {
      const errorEl = document.getElementById(key + "-error");
      if (!errorEl) return;
      if (errors[key]) {
        errorEl.textContent = errors[key];
        errorEl.hidden = false;
        firstInvalid = firstInvalid || fields[key];
      } else {
        errorEl.hidden = true;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus();
      showToast("Check the highlighted fields and try again.", "error");
      return;
    }

    const order = {
      id: "TH-" + Date.now().toString().slice(-8),
      date: new Date().toISOString(),
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      address: fields.address.value.trim(),
      payment: paymentMethod,
      items: cart.map((item) => ({ id: item.id, qty: item.qty })),
      total: total
    };
    const orders = readStore(STORAGE_KEYS.orders, []);
    orders.push(order);
    writeStore(STORAGE_KEYS.orders, orders);
    saveCart([]);

    showCheckoutSuccess(order);
  });
}

function showCheckoutSuccess(order) {
  const overlay = document.createElement("div");
  overlay.className = "success-overlay";
  overlay.innerHTML = `
    <div class="success-card">
      <div class="success-check" aria-hidden="true">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"><path d="M4 12l5 5L20 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </div>
      <h2>Order placed!</h2>
      <p>Order <strong>${order.id}</strong> is confirmed. A receipt has been sent to ${order.email}.</p>
      <a class="btn btn--primary" href="index.html">Back to Home</a>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add("success-overlay--visible"));
}

/* ==========================================================================
   WISHLIST PAGE
   ========================================================================== */
function initWishlistPage() {
  const grid = document.getElementById("wishlist-grid");
  if (!grid) return;

  const tabs = document.querySelectorAll(".wishlist-tab");
  let activeFilter = "all";

  function render() {
    const list = getWishlist();
    const ids = Object.keys(list);

    document.getElementById("count-all").textContent = ids.length;
    document.getElementById("count-interested").textContent = ids.filter((id) => list[id] === "interested").length;
    document.getElementById("count-owned").textContent = ids.filter((id) => list[id] === "owned").length;

    const visibleIds = ids.filter((id) => activeFilter === "all" || list[id] === activeFilter);

    grid.innerHTML = visibleIds.length
      ? visibleIds
          .map((id) => {
            const product = findProduct(id);
            if (!product) return "";
            const status = list[id];
            const meta = TOY_HAVEN_CATEGORIES[product.category] || {};
            return `
            <article class="product-card wishlist-card" data-id="${id}" data-reveal>
              <div class="product-media" style="--cat-color:${meta.color || "var(--color-primary)"}">
                <img class="product-media-img" src="${product.image}" alt="" loading="lazy" style="object-position:${product.imagePosition || "center"}">
                <button class="wish-toggle wish-toggle--active" data-action="remove-wish" aria-label="Remove from wishlist">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21s-7.5-4.6-10-9.1C.5 8.4 2.4 5 6 5c2 0 3.4 1 4 2.4C10.6 6 12 5 14 5c3.6 0 5.5 3.4 4 6.9C19.5 16.4 12 21 12 21z"/></svg>
                </button>
              </div>
              <div class="product-body">
                <span class="product-category">${product.category}</span>
                <h3 class="product-name">${product.name}</h3>
                <span class="product-price">${formatPrice(product.price)}</span>
                <div class="status-group" role="group" aria-label="Collection status">
                  <button class="status-btn${status === "interested" ? " status-btn--active" : ""}" data-status="interested">Interested</button>
                  <button class="status-btn${status === "owned" ? " status-btn--active" : ""}" data-status="owned">Owned</button>
                  <button class="status-btn${status === "not-interested" ? " status-btn--active" : ""}" data-status="not-interested">Not Interested</button>
                </div>
              </div>
            </article>
          `;
          })
          .join("")
      : `<p class="empty-state">Nothing tracked here yet. Heart a product on the <a href="products.html">shop page</a> to start your collection.</p>`;

    grid.querySelectorAll(".wishlist-card").forEach((card) => {
      const id = card.getAttribute("data-id");
      card.querySelector('[data-action="remove-wish"]').addEventListener("click", () => {
        toggleWishlist(id);
        render();
      });
      card.querySelectorAll(".status-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          setWishlistStatus(id, btn.getAttribute("data-status"));
          render();
        });
      });
    });

    initScrollReveal();
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("wishlist-tab--active"));
      tab.classList.add("wishlist-tab--active");
      activeFilter = tab.getAttribute("data-filter");
      render();
    });
  });

  render();
}

/* ==========================================================================
   SUPPORT PAGE (feedback form + FAQ accordion)
   ========================================================================== */
function initSupportPage() {
  const form = document.getElementById("feedback-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = form.elements["name"];
      const email = form.elements["email"];
      const message = form.elements["message"];
      const errors = {
        name: !name.value.trim() ? "Enter your name." : "",
        email: !isValidEmail(email.value) ? "Enter a valid email address." : "",
        message: !message.value.trim() ? "Tell us what's going on." : ""
      };
      let firstInvalid = null;
      Object.keys(errors).forEach((key) => {
        const errorEl = document.getElementById(key + "-field-error");
        if (errors[key]) {
          errorEl.textContent = errors[key];
          errorEl.hidden = false;
          firstInvalid = firstInvalid || form.elements[key];
        } else {
          errorEl.hidden = true;
        }
      });
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const feedback = readStore(STORAGE_KEYS.feedback, []);
      feedback.push({
        name: name.value.trim(),
        email: email.value.trim(),
        message: message.value.trim(),
        date: new Date().toISOString()
      });
      writeStore(STORAGE_KEYS.feedback, feedback);

      document.getElementById("feedback-success").hidden = false;
      form.reset();
      showToast("Support case submitted", "success");
    });
  }

  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("faq-item--open");
      document.querySelectorAll(".faq-item").forEach((other) => other.classList.remove("faq-item--open"));
      if (!isOpen) item.classList.add("faq-item--open");
    });
  });
}

/* ==========================================================================
   Boot
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initHomePage();
  initProductsPage();
  initCartPage();
  initCheckoutPage();
  initWishlistPage();
  initSupportPage();
  initScrollReveal();

  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
});
