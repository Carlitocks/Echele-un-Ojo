// Archivo JS extraído de echele_un_ojo.html

// Navbar scroll
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 40);
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Filter products
function filterProducts(btn, cat) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    const show = cat === 'todos' || card.dataset.cat === cat;
    card.style.display = show ? '' : 'none';
  });
}

// Carrito
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(btn) {
  const card = btn.closest('.product-card');
  const name = card.querySelector('.product-name').textContent;
  const priceText = card.querySelector('.product-price').textContent;
  const price = parseInt(priceText.replace(/[^0-9]/g, ''));
  const emoji = card.querySelector('.product-emoji').textContent;

  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.qty++;
  } else {
    cart.push({ name, price, emoji, qty: 1 });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();

  const orig = btn.textContent;
  btn.textContent = '✓';
  btn.style.background = 'var(--verde-dark)';
  btn.style.transform = 'scale(1.2) rotate(0deg)';
  setTimeout(() => {
    btn.textContent = orig;
    btn.style.background = '';
    btn.style.transform = '';
  }, 1200);
}

function updateCartUI() {
  const count = cart.reduce((acc, item) => acc + item.qty, 0);
  document.querySelector('.cart-count').textContent = count;
  document.querySelector('.cart-count').style.display = count > 0 ? 'flex' : 'none';
  renderCart();
}

function renderCart() {
  const cartBody = document.querySelector('.cart-modal-body');
  if (cart.length === 0) {
    cartBody.innerHTML = '<div class="cart-empty"><div class="cart-empty-icon">🛒</div><p>Tu carrito está vacío</p></div>';
    return;
  }
  cartBody.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <span style="font-size:20px;">${item.emoji}</span>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toLocaleString()}</div>
      </div>
      <div class="cart-item-qty">
        <button onclick="updateQty(${idx}, -1)">−</button>
        <span>${item.qty}</span>
        <button onclick="updateQty(${idx}, 1)">+</button>
      </div>
      <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕</button>
    </div>
  `).join('');
  updateTotal();
}

function updateQty(idx, change) {
  cart[idx].qty += change;
  if (cart[idx].qty <= 0) {
    cart.splice(idx, 1);
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function removeFromCart(idx) {
  cart.splice(idx, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function updateTotal() {
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  document.querySelector('.cart-total-amount').textContent = '$' + total.toLocaleString();
}

function toggleCartModal() {
  document.querySelector('.cart-modal').classList.toggle('active');
}

function clearCart() {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cart = [];
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }
}

function checkout() {
  if (cart.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const items = cart.map(item => `${item.name} x${item.qty}`).join(', ');
  const wa = `Hola, quiero realizar el siguiente pedido: ${items}. TOTAL: $${total.toLocaleString()}`;
  window.open(`https://wa.me/573002987081?text=${encodeURIComponent(wa)}`, '_blank');
}

// Inicializar carrito al cargar
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
});

// Star rating
let currentStars = 0;
function setStars(n) {
  currentStars = n;
  const btns = document.querySelectorAll('#starSelect button');
  btns.forEach((b, i) => b.classList.toggle('active', i < n));
}

// Submit review
function submitReview() {
  const btn = document.querySelector('.btn-submit');
  btn.textContent = '¡Reseña publicada! ✓';
  btn.style.background = 'var(--verde-dark)';
  btn.style.color = '#fff';
  setTimeout(() => {
    btn.textContent = 'Publicar reseña';
    btn.style.background = '';
    btn.style.color = '';
  }, 2500);
}
