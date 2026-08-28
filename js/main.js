/**
 * HOBBIX - Tabletop & Hobby Games Store
 * Core Main JavaScript (Cart, Wishlist, Search, Modals, Toasts, Navigation)
 */

// State Management
const AppState = {
  cart: JSON.parse(localStorage.getItem('hobbix_cart') || localStorage.getItem('hex_cart')) || [
    { id: "prod-1", qty: 1 },
    { id: "prod-8", qty: 2 }
  ],
  wishlist: JSON.parse(localStorage.getItem('hobbix_wishlist') || localStorage.getItem('hex_wishlist')) || ["prod-2", "prod-7"],
  theme: localStorage.getItem('hobbix_theme') || localStorage.getItem('hex_vault_theme') || 'dark',
  direction: localStorage.getItem('hobbix_dir') || localStorage.getItem('hex_vault_dir') || 'ltr',

  initTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeUI();
  },

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('hex_vault_theme', this.theme);
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeUI();
    showToast(`Switched to ${this.theme === 'dark' ? 'Dark' : 'Light'} Mode`, 'info');
  },

  updateThemeUI() {
    const btns = document.querySelectorAll('.theme-toggle-btn, #theme-toggle-btn');
    btns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (this.theme === 'light') {
          icon.className = 'fa-solid fa-sun text-gold';
          btn.setAttribute('title', 'Switch to Dark Mode');
        } else {
          icon.className = 'fa-solid fa-moon';
          btn.setAttribute('title', 'Switch to Light Mode');
        }
      }
    });
  },

  initRTL() {
    document.documentElement.setAttribute('dir', this.direction);
    this.updateRTLUI();
  },

  toggleRTL() {
    this.direction = this.direction === 'ltr' ? 'rtl' : 'ltr';
    localStorage.setItem('hex_vault_dir', this.direction);
    document.documentElement.setAttribute('dir', this.direction);
    this.updateRTLUI();
    showToast(`Switched to ${this.direction.toUpperCase()} Direction`, 'info');
  },

  updateRTLUI() {
    const btns = document.querySelectorAll('.rtl-toggle-btn, #rtl-toggle-btn');
    btns.forEach(btn => {
      if (this.direction === 'rtl') {
        btn.classList.add('active');
        btn.style.borderColor = 'var(--accent-gold)';
        btn.style.color = 'var(--accent-gold)';
        btn.setAttribute('title', 'Switch to LTR (Left-to-Right)');
      } else {
        btn.classList.remove('active');
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.setAttribute('title', 'Switch to RTL (Right-to-Left)');
      }
    });
  },
  
  saveCart() {
    localStorage.setItem('hex_cart', JSON.stringify(this.cart));
    this.updateCartUI();
  },
  
  saveWishlist() {
    localStorage.setItem('hex_wishlist', JSON.stringify(this.wishlist));
    this.updateWishlistUI();
  },

  addToCart(productId, qty = 1) {
    const existing = this.cart.find(item => item.id === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      this.cart.push({ id: productId, qty });
    }
    this.saveCart();
    const prod = STORE_DATA.products.find(p => p.id === productId);
    showToast(`Added "${prod ? prod.title : 'Game'}" to Cart!`, 'success');
    openCartDrawer();
  },

  removeFromCart(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCart();
    showToast("Item removed from cart", "info");
  },

  updateQty(productId, delta) {
    const item = this.cart.find(item => item.id === productId);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        this.removeFromCart(productId);
      } else {
        this.saveCart();
      }
    }
  },

  toggleWishlist(productId) {
    const idx = this.wishlist.indexOf(productId);
    const prod = STORE_DATA.products.find(p => p.id === productId);
    if (idx > -1) {
      this.wishlist.splice(idx, 1);
      showToast(`Removed from Wishlist`, 'info');
    } else {
      this.wishlist.push(productId);
      showToast(`Saved "${prod ? prod.title : 'Game'}" to Wishlist!`, 'success');
    }
    this.saveWishlist();
  },

  updateCartUI() {
    const cartCountBadges = document.querySelectorAll('.cart-count');
    const totalItems = this.cart.reduce((sum, item) => sum + item.qty, 0);
    cartCountBadges.forEach(b => b.textContent = totalItems);

    const cartListEl = document.getElementById('cart-items-list');
    const subtotalEl = document.getElementById('cart-subtotal-amount');
    const totalEl = document.getElementById('cart-total-amount');
    const freeShippingProgress = document.getElementById('shipping-progress-fill');
    const shippingStatusText = document.getElementById('free-shipping-status');

    if (!cartListEl) return;

    if (this.cart.length === 0) {
      cartListEl.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-dice-d20" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem; opacity: 0.5;"></i>
          <p style="font-size: 1.1rem; color: var(--text-primary); font-weight: 600;">Your Cart is Empty</p>
          <p style="font-size: 0.9rem; margin-top: 0.25rem;">Discover new tabletop adventures to get started!</p>
          <a href="products.html" class="btn btn-primary btn-sm" style="margin-top: 1.25rem;">Browse Products</a>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      if (totalEl) totalEl.textContent = '$0.00';
      if (freeShippingProgress) freeShippingProgress.style.width = '0%';
      if (shippingStatusText) shippingStatusText.innerHTML = 'Add <strong>$75.00</strong> more for Free Delivery';
      return;
    }

    let subtotal = 0;
    cartListEl.innerHTML = this.cart.map(cartItem => {
      const prod = STORE_DATA.products.find(p => p.id === cartItem.id);
      if (!prod) return '';
      const itemTotal = prod.price * cartItem.qty;
      subtotal += itemTotal;
      return `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${prod.image}" alt="${prod.title}">
          </div>
          <div class="cart-item-info">
            <h4>${prod.title}</h4>
            <div class="cart-item-price">$${prod.price.toFixed(2)}</div>
            <div class="cart-item-qty">
              <button class="cart-qty-btn" onclick="AppState.updateQty('${prod.id}', -1)" aria-label="Decrease quantity"><i class="fa-solid fa-minus"></i></button>
              <span class="cart-qty-num">${cartItem.qty}</span>
              <button class="cart-qty-btn" onclick="AppState.updateQty('${prod.id}', 1)" aria-label="Increase quantity"><i class="fa-solid fa-plus"></i></button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="AppState.removeFromCart('${prod.id}')" aria-label="Remove item">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      `;
    }).join('');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

    // Free Shipping Tier ($75 Threshold)
    const threshold = 75;
    const pct = Math.min(100, (subtotal / threshold) * 100);
    if (freeShippingProgress) freeShippingProgress.style.width = `${pct}%`;
    if (shippingStatusText) {
      if (subtotal >= threshold) {
        shippingStatusText.innerHTML = '<span style="color: var(--accent-emerald); font-weight: 700;"><i class="fa-solid fa-circle-check"></i> You unlocked FREE Express Delivery!</span>';
      } else {
        const remaining = (threshold - subtotal).toFixed(2);
        shippingStatusText.innerHTML = `Add <strong>$${remaining}</strong> more for <strong>FREE Delivery</strong>`;
      }
    }
  },

  updateWishlistUI() {
    const countBadges = document.querySelectorAll('.wishlist-count');
    countBadges.forEach(b => b.textContent = this.wishlist.length);

    // Update heart icons across the page
    document.querySelectorAll('.btn-quick-action.wishlist-toggle').forEach(btn => {
      const id = btn.getAttribute('data-id');
      if (this.wishlist.includes(id)) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-heart"></i>';
      } else {
        btn.classList.remove('active');
        btn.innerHTML = '<i class="fa-regular fa-heart"></i>';
      }
    });
  }
};

// Global Helpers - Toast Popups Disabled per user request
function showToast(msg, type = 'info') {
  // Toast notifications disabled to prevent screen obstruction
  return;
}

// Drawers & Modals Control
function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('modal-overlay-backdrop');
  if (drawer && overlay) {
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const overlay = document.getElementById('modal-overlay-backdrop');
  const freeShippingBar = document.querySelector('.cart-free-shipping');
  const cartFooter = document.querySelector('.cart-footer');
  if (freeShippingBar) freeShippingBar.style.display = '';
  if (cartFooter) cartFooter.style.display = '';
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Order Placement Handler
function handlePlaceOrder() {
  if (!AppState.cart || AppState.cart.length === 0) return;

  const orderNum = Math.floor(10000 + Math.random() * 90000);
  const totalAmount = document.getElementById('cart-total-amount')?.textContent || '$0.00';
  const cartBody = document.getElementById('cart-items-list');
  const cartFooter = document.querySelector('.cart-footer');
  const freeShippingBar = document.querySelector('.cart-free-shipping');

  if (cartBody) {
    if (freeShippingBar) freeShippingBar.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'none';

    cartBody.innerHTML = `
      <div style="text-align: center; padding: 2rem 1rem;">
        <div style="width: 68px; height: 68px; margin: 0 auto 1.25rem; border-radius: 50%; background: linear-gradient(135deg, #10b981 0%, #059669 100%); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 2rem; box-shadow: 0 0 25px rgba(16, 185, 129, 0.4);">
          <i class="fa-solid fa-check"></i>
        </div>
        <span class="badge badge-gold" style="margin-bottom: 0.75rem;"><i class="fa-solid fa-circle-check"></i> Order Confirmed</span>
        <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--text-primary); margin-bottom: 0.5rem;">Your Order Has Been Placed!</h3>
        <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
          Thank you for choosing Hobbix! Your order <strong>#HBX-${orderNum}</strong> has been confirmed and is being prepped for dispatch.
        </p>
        <div style="background: var(--bg-card); border: 1px solid var(--glass-border); border-radius: var(--radius-md); padding: 1rem; margin-bottom: 1.5rem; text-align: left; font-family: var(--font-mono); font-size: 0.82rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem; color: var(--text-muted);">
            <span>Order Number:</span> <strong style="color: var(--text-primary);">#HBX-${orderNum}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem; color: var(--text-muted);">
            <span>Total Paid:</span> <strong style="color: var(--accent-gold); font-size: 0.95rem;">${totalAmount}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; color: var(--text-muted);">
            <span>Dispatch Status:</span> <strong style="color: var(--accent-emerald);">Today before 4:00 PM</strong>
          </div>
        </div>
        <button class="btn btn-primary" onclick="resetOrderAndClose();" style="width: 100%; justify-content: center;">
          <i class="fa-solid fa-dice-d20"></i> Continue Exploring Vault
        </button>
      </div>
    `;

    // Clear cart state
    AppState.cart = [];
    localStorage.setItem('hex_cart', JSON.stringify([]));
    const cartCountBadges = document.querySelectorAll('.cart-count');
    cartCountBadges.forEach(b => b.textContent = '0');
  }
}

function resetOrderAndClose() {
  const freeShippingBar = document.querySelector('.cart-free-shipping');
  const cartFooter = document.querySelector('.cart-footer');
  if (freeShippingBar) freeShippingBar.style.display = '';
  if (cartFooter) cartFooter.style.display = '';
  AppState.updateCartUI();
  closeCartDrawer();
}

function openSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    const input = document.getElementById('global-search-input');
    if (input) {
      input.focus();
      renderSearchResults('');
    }
  }
}

function closeSearchModal() {
  const modal = document.getElementById('search-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function openQuickView(productId) {
  const prod = STORE_DATA.products.find(p => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('quickview-modal');
  const body = document.getElementById('quickview-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div class="quickview-modal-layout">
      <div class="quickview-img-box">
        <img src="${prod.image}" alt="${prod.title}" class="quickview-img">
        ${prod.badge ? `<span class="quickview-badge-overlay">${prod.badge}</span>` : ''}
      </div>
      <div class="quickview-content-box">
        <div class="quickview-tags-row">
          <span class="badge badge-gold">${prod.category}</span>
          <span class="badge badge-emerald" style="background: rgba(16,185,129,0.15); color: var(--accent-emerald); border: 1px solid rgba(16,185,129,0.35);">
            <i class="fa-solid fa-check-circle"></i> In Stock
          </span>
        </div>
        <h3 class="quickview-modal-title">${prod.title}</h3>
        <div class="quickview-meta-row">
          <span class="quickview-rating">
            <i class="fa-solid fa-star text-gold"></i> ${prod.rating} (${prod.reviews} Reviews)
          </span>
        </div>
        <div class="quickview-price-row">
          <span class="quickview-current-price">$${prod.price.toFixed(2)}</span>
          ${prod.originalPrice ? `<span class="quickview-orig-price">$${prod.originalPrice.toFixed(2)}</span>` : ''}
          ${prod.discount ? `<span class="badge badge-discount">${prod.discount}</span>` : ''}
        </div>
        <p class="quickview-description">
          ${prod.description}
        </p>
        <div class="quickview-specs-row">
          <div class="quickview-spec-chip">
            <i class="fa-solid fa-users text-gold"></i>
            <span>${prod.players}</span>
          </div>
          <div class="quickview-spec-chip">
            <i class="fa-solid fa-clock text-orange"></i>
            <span>${prod.time}</span>
          </div>
          <div class="quickview-spec-chip">
            <i class="fa-solid fa-brain text-purple"></i>
            <span>${prod.difficulty}</span>
          </div>
        </div>
        <div class="quickview-actions-row">
          <button class="btn btn-primary quickview-btn-add" onclick="AppState.addToCart('${prod.id}'); closeQuickView();">
            <i class="fa-solid fa-cart-shopping"></i> Add To Cart
          </button>
          <button class="btn btn-secondary btn-icon-only quickview-btn-wish" onclick="AppState.toggleWishlist('${prod.id}')" title="Save to Wishlist">
            <i class="fa-regular fa-heart"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

// Event Join Modal
function openJoinEventModal(eventId) {
  const evt = STORE_DATA.events.find(e => e.id === eventId);
  if (!evt) return;

  const modal = document.getElementById('event-modal');
  const body = document.getElementById('event-modal-body');
  if (!modal || !body) return;

  body.innerHTML = `
    <div>
      <span class="section-tag"><i class="fa-solid fa-dice-d20"></i> Tabletop Gathering</span>
      <h3 style="font-size: 1.6rem; margin: 0.5rem 0 1rem;">${evt.title}</h3>
      <div style="background: var(--bg-card); border-radius: var(--radius-lg); padding: 1.25rem; border: 1px solid var(--glass-border); margin-bottom: 1.5rem;">
        <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.95rem;">
          <div><strong class="text-gold"><i class="fa-solid fa-chess-board"></i> Featured Game:</strong> ${evt.game}</div>
          <div><strong class="text-gold"><i class="fa-regular fa-calendar"></i> Date & Time:</strong> ${evt.day} ${evt.month}, ${evt.time}</div>
          <div><strong class="text-gold"><i class="fa-solid fa-location-dot"></i> Venue:</strong> ${evt.location}</div>
          <div><strong class="text-gold"><i class="fa-solid fa-ticket"></i> Entry:</strong> ${evt.fee}</div>
          <div><strong class="text-gold"><i class="fa-solid fa-chair"></i> Available Seats:</strong> ${evt.seatsLeft} of ${evt.seatsTotal} remaining</div>
        </div>
      </div>
      <form id="join-event-form" onsubmit="handleJoinEventSubmit(event, '${evt.id}')">
        <div class="form-group">
          <label>Your Full Name *</label>
          <input type="text" class="form-control" id="event-user-name" required placeholder="e.g., Jane Doe">
        </div>
        <div class="form-group">
          <label>Email Address for Ticket & Table Invite *</label>
          <input type="email" class="form-control" id="event-user-email" required placeholder="e.g., jane@tabletop.com">
        </div>
        <div class="form-group">
          <label>Experience Level</label>
          <select class="form-control" id="event-user-exp">
            <option value="first-time">Complete Beginner (Need Rules Walkthrough)</option>
            <option value="intermediate" selected>Casual Player (Know basic mechanics)</option>
            <option value="expert">Veteran / Competitive Player</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 0.5rem;">
          <i class="fa-solid fa-check"></i> Reserve My Seat
        </button>
      </form>
    </div>
  `;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeJoinEventModal() {
  const modal = document.getElementById('event-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function handleJoinEventSubmit(e, eventId) {
  e.preventDefault();
  const name = document.getElementById('event-user-name').value;
  const evt = STORE_DATA.events.find(ev => ev.id === eventId);
  if (evt && evt.seatsLeft > 0) {
    evt.seatsLeft -= 1;
  }
  closeJoinEventModal();
  showToast(`Seat Reserved for ${name}! Check your email for table info.`, 'success');
}

// Search Results Renderer
function renderSearchResults(query) {
  const resultsContainer = document.getElementById('search-results-list');
  if (!resultsContainer) return;

  const cleanQuery = query.toLowerCase().trim();
  const filtered = cleanQuery === '' 
    ? STORE_DATA.products.slice(0, 5) 
    : STORE_DATA.products.filter(p => 
        p.title.toLowerCase().includes(cleanQuery) || 
        p.category.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery)
      );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--text-muted);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; margin-bottom: 0.5rem; opacity: 0.5;"></i>
        <p>No games found matching "${query}"</p>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = filtered.map(prod => `
    <div class="search-result-item" onclick="openQuickView('${prod.id}'); closeSearchModal();">
      <div class="search-result-img">
        <img src="${prod.image}" alt="${prod.title}">
      </div>
      <div style="flex: 1;">
        <h4 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 0.15rem;">${prod.title}</h4>
        <div style="display: flex; gap: 0.75rem; font-size: 0.8rem; font-family: var(--font-mono);">
          <span style="color: var(--accent-gold); font-weight: 700;">$${prod.price.toFixed(2)}</span>
          <span style="color: var(--text-muted);">${prod.category}</span>
          <span style="color: #f59e0b;"><i class="fa-solid fa-star"></i> ${prod.rating}</span>
        </div>
      </div>
      <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); AppState.addToCart('${prod.id}'); closeSearchModal();">
        <i class="fa-solid fa-cart-plus"></i>
      </button>
    </div>
  `).join('');
}

// Generate Standard Product Card HTML
function createProductCardHTML(prod) {
  const isWishlisted = AppState.wishlist.includes(prod.id);
  return `
    <div class="game-card" data-product-id="${prod.id}">
      <div class="card-media">
        <img src="${prod.image}" alt="${prod.title}" loading="lazy">
        <div class="card-gradient-overlay"></div>
        <div class="card-badges">
          ${prod.badge ? `<span class="card-badge-glow"><i class="fa-solid fa-sparkles"></i> ${prod.badge}</span>` : ''}
          ${prod.discount ? `<span class="card-badge-discount">${prod.discount}</span>` : ''}
        </div>
        <div class="card-actions-quick">
          <button class="btn-quick-action wishlist-toggle ${isWishlisted ? 'active' : ''}" data-id="${prod.id}" onclick="AppState.toggleWishlist('${prod.id}')" title="Save to Wishlist" aria-label="Toggle Wishlist">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <button class="btn-quick-action" onclick="openQuickView('${prod.id}')" title="Quick Preview" aria-label="Quick View">
            <i class="fa-solid fa-eye"></i>
          </button>
        </div>
      </div>
      <div class="card-body-content">
        <div class="product-meta-header">
          <span class="product-category-tag">${prod.category}</span>
          <div class="product-rating-pill">
            <i class="fa-solid fa-star"></i>
            <span>${prod.rating}</span>
          </div>
        </div>
        <h3 class="product-title" title="${prod.title}">${prod.title}</h3>
        <div class="product-specs-chips">
          <span class="spec-chip"><i class="fa-solid fa-users"></i> ${prod.players}</span>
          <span class="spec-chip"><i class="fa-regular fa-clock"></i> ${prod.time}</span>
          <span class="spec-chip spec-difficulty"><i class="fa-solid fa-layer-group"></i> ${prod.difficulty}</span>
        </div>
        <div class="card-divider"></div>
        <div class="card-footer-row">
          <div class="product-price-box">
            <span class="price-current">$${prod.price.toFixed(2)}</span>
            ${prod.originalPrice ? `<span class="price-original">$${prod.originalPrice.toFixed(2)}</span>` : ''}
          </div>
          <button class="btn-add-cart" onclick="AppState.addToCart('${prod.id}')" aria-label="Add ${prod.title} to cart">
            <i class="fa-solid fa-cart-plus"></i>
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

// Generate Standard Event Card HTML
function createEventCardHTML(evt) {
  const percentFilled = Math.round(((evt.seatsTotal - evt.seatsLeft) / evt.seatsTotal) * 100);
  return `
    <div class="event-card">
      <div class="event-media">
        <img src="${evt.image}" alt="${evt.title}" loading="lazy">
        <div class="event-date-badge">
          <div class="day">${evt.day}</div>
          <div class="month">${evt.month}</div>
        </div>
      </div>
      <div class="event-content">
        <span class="event-type-tag"><i class="fa-solid fa-dice-d20"></i> ${evt.game}</span>
        <h3 class="event-title">${evt.title}</h3>
        <ul class="event-details-list">
          <li><i class="fa-regular fa-clock"></i> ${evt.time}</li>
          <li><i class="fa-solid fa-user-shield"></i> Host: ${evt.host}</li>
          <li><i class="fa-solid fa-ticket"></i> Entry: ${evt.fee}</li>
          <li><i class="fa-solid fa-location-dot"></i> ${evt.location}</li>
        </ul>
        <div class="event-seats-bar">
          <div class="seats-status-text">
            <span>Seats Reserved</span>
            <span class="text-gold font-mono">${evt.seatsTotal - evt.seatsLeft} / ${evt.seatsTotal}</span>
          </div>
          <div class="seats-bar-track">
            <div class="seats-bar-fill" style="width: ${percentFilled}%;"></div>
          </div>
        </div>
        <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: 0.5rem;" onclick="openJoinEventModal('${evt.id}')">
          <i class="fa-solid fa-user-plus"></i> Join Event
        </button>
      </div>
    </div>
  `;
}

// Generate Standard Article Card HTML
function createArticleCardHTML(art) {
  return `
    <div class="article-card" onclick="if(!event.target.closest('a')) window.location.href='blog-detail.html?id=${art.id}'" style="cursor: pointer;">
      <div class="article-img-wrap">
        <a href="blog-detail.html?id=${art.id}" aria-label="${art.title}">
          <img src="${art.image}" alt="${art.title}" loading="lazy">
        </a>
      </div>
      <div class="article-content">
        <div class="article-meta-row">
          <span class="badge badge-purple">${art.category}</span>
          <span><i class="fa-regular fa-clock"></i> ${art.readTime}</span>
        </div>
        <h3 class="article-title">
          <a href="blog-detail.html?id=${art.id}" style="color: inherit; text-decoration: none;">${art.title}</a>
        </h3>
        <p class="article-excerpt">${art.excerpt}</p>
        <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 1rem;">
          <span style="font-size: 0.85rem; color: var(--text-muted);"><i class="fa-regular fa-user"></i> ${art.author}</span>
          <a href="blog-detail.html?id=${art.id}" class="text-gold font-heading" style="font-weight: 700; font-size: 0.95rem; display: flex; align-items: center; gap: 0.35rem;">
            Read Article <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  `;
}

// Global Window Helpers
window.toggleTheme = () => AppState.toggleTheme();
window.toggleRTL = () => AppState.toggleRTL();

// Global Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme & Direction
  AppState.initTheme();
  AppState.initRTL();

  // Initialize UI
  AppState.updateCartUI();
  AppState.updateWishlistUI();

  // Scroll Header Effect
  const header = document.querySelector('.site-header');
  const backToTopBtn = document.getElementById('back-to-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Mobile Menu Toggling
  const hamburgerBtn = document.getElementById('mobile-hamburger-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileOverlay = document.getElementById('mobile-drawer-overlay');

  window.closeMobileMenu = function() {
    if (hamburgerBtn) hamburgerBtn.classList.remove('active');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
  };

  if (hamburgerBtn && mobileDrawer && mobileOverlay) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      mobileDrawer.classList.toggle('open');
      mobileOverlay.classList.toggle('open');
    });

    mobileOverlay.addEventListener('click', () => {
      window.closeMobileMenu();
    });
  }

  // Global Search Input Trigger
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // Universal Newsletter Validation
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      if (input && input.value.trim() && input.value.includes('@')) {
        showToast("Success! You're subscribed to Mythic Tabletop drops & promos.", "success");
        input.value = '';
      } else {
        showToast("Please enter a valid email address.", "error");
      }
    });
  });

  // Highlight Current Navigation Link
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});

// Reference-Matched 3D Deck Carousel Controller
let currentRefDeckIdx = 1;
const totalRefDeckCards = 5;

function updateRefDeckUI() {
  const cards = document.querySelectorAll('.ref-deck-card');
  const dots = document.querySelectorAll('.ref-deck-dot');
  if (!cards.length) return;

  const prevIdx = (currentRefDeckIdx - 1 + totalRefDeckCards) % totalRefDeckCards;
  const nextIdx = (currentRefDeckIdx + 1) % totalRefDeckCards;

  cards.forEach((card, idx) => {
    card.classList.remove('is-active', 'is-prev', 'is-next');
    if (idx === currentRefDeckIdx) {
      card.classList.add('is-active');
    } else if (idx === prevIdx) {
      card.classList.add('is-prev');
    } else if (idx === nextIdx) {
      card.classList.add('is-next');
    }
  });

  dots.forEach((dot, idx) => {
    if (idx === currentRefDeckIdx) {
      dot.classList.add('active');
    } else {
      dot.classList.remove('active');
    }
  });
}

function rotateRefDeck(dir) {
  currentRefDeckIdx = (currentRefDeckIdx + dir + totalRefDeckCards) % totalRefDeckCards;
  updateRefDeckUI();
}

function setRefDeckIndex(idx) {
  currentRefDeckIdx = idx;
  updateRefDeckUI();
}

// Click on prev/next card directly to slide
document.addEventListener('DOMContentLoaded', () => {
  const deckStage = document.getElementById('ref-deck-stage');
  if (deckStage) {
    deckStage.addEventListener('click', (e) => {
      const prevCard = e.target.closest('.ref-deck-card.is-prev');
      const nextCard = e.target.closest('.ref-deck-card.is-next');
      if (prevCard) rotateRefDeck(-1);
      if (nextCard) rotateRefDeck(1);
    });
  }
});
