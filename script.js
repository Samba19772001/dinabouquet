(() => {
  const WHATSAPP = "221778691368";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const cart = [];
  const cartOverlay = $("#cartOverlay");
  const cartItems = $("#cartItems");
  const cartCount = $("#cartCount");
  const cartTitleCount = $("#cartTitleCount");
  const toast = $("#toast");
  let toastTimer;

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  const menuToggle = $(".menu-toggle");
  const navLinks = $("#navLinks");
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
      menuToggle.textContent = isOpen ? "×" : "☰";
    });
    $$("#navLinks a").forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }));
  }

  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add("visible"));

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }
  function openCart() {
    if (!cartOverlay) return;
    cartOverlay.hidden = false;
    document.body.style.overflow = "hidden";
    renderCart();
    $("#closeCart")?.focus();
  }
  function closeCart() {
    if (!cartOverlay) return;
    cartOverlay.hidden = true;
    document.body.style.overflow = "";
    $("#openCart")?.focus();
  }

  $("#openCart")?.addEventListener("click", openCart);
  $("#closeCart")?.addEventListener("click", closeCart);
  $("#closeCartBackdrop")?.addEventListener("click", closeCart);
  $("#continueShopping")?.addEventListener("click", closeCart);
  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && cartOverlay && !cartOverlay.hidden) closeCart();
  });

  function addToCart(name, image) {
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, image, quantity: 1 });
    renderCart();
    showToast(name + " ajouté à votre panier.");
  }
  function renderCart() {
    if (!cartItems || !cartCount || !cartTitleCount) return;
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = total;
    cartTitleCount.textContent = "(" + total + ")";
    if (!cart.length) {
      cartItems.innerHTML = '<div class="empty-cart"><span>♡</span><p>Votre panier est encore vide.</p><small>Ajoutez une collection pour préparer votre demande.</small></div>';
      return;
    }
    cartItems.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <img src="${item.image}" alt="">
        <div><h4>${escapeHtml(item.name)}</h4><small>Sur devis · Quantité : ${item.quantity}</small></div>
        <button class="remove-item" data-remove="${index}" aria-label="Retirer ${escapeHtml(item.name)}">×</button>
      </div>`).join("");
    $$("[data-remove]", cartItems).forEach(button => button.addEventListener("click", () => {
      cart.splice(Number(button.dataset.remove), 1);
      renderCart();
    }));
  }
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[char]));
  }

  $$("[data-add]").forEach(button => button.addEventListener("click", () => {
    const card = button.closest(".collection-card");
    addToCart(button.dataset.add, card?.dataset.image || "assets/images/ours-peluche-bouquet.jpeg");
    if (window.innerWidth < 600) openCart();
  }));

  $("#checkoutButton")?.addEventListener("click", () => {
    if (!cart.length) {
      showToast("Ajoutez d'abord une création à votre panier.");
      return;
    }
    const lines = cart.map(item => `• ${item.name} (quantité : ${item.quantity})`).join("\n");
    const message = `Bonjour Dina Bouquet, je souhaite un devis pour les créations suivantes :\n\n${lines}\n\nPouvez-vous m'indiquer les tarifs, les options de personnalisation et les modalités de livraison ?`;
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message), "_blank", "noopener");
  });

  $("#quoteForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const name = $("#customerName")?.value.trim() || "";
    const occasion = $("#occasion")?.value || "";
    const budget = $("#budget")?.value.trim() || "À discuter";
    const details = $("#details")?.value.trim() || "À préciser ensemble";
    const message = `Bonjour Dina Bouquet,\nJe souhaite demander un devis personnalisé.\n\nNom : ${name}\nOccasion : ${occasion}\nBudget estimé : ${budget}\nMon idée : ${details}\n\nPouvez-vous me conseiller sur les possibilités et la livraison ?`;
    window.open("https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent(message), "_blank", "noopener");
  });

  const floatingWhatsapp = $("#floatingWhatsapp");
  if (floatingWhatsapp) floatingWhatsapp.href = "https://wa.me/" + WHATSAPP + "?text=" + encodeURIComponent("Bonjour Dina Bouquet, je souhaite avoir des informations sur vos créations.");
})();