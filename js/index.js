// On importe la "mini base" (seed JSON -> localStorage) + lecture DB
import { initDB, getDB } from "./db.js";

// On importe le panier : compter et ajouter un produit
import { getCartCount, addToCart } from "./cart.js";

// On importe la session (connecté ? admin ?)
import { getSession } from "./auth.js";

// ====== Références DOM ======
// Container qui va recevoir toutes les cartes produits
const productsEl = document.getElementById("products");

// Bouton/lien panier dans le header
const cartBtn = document.getElementById("cartBtn");

// Bouton "Se connecter / Mon compte"
const accountLink = document.getElementById("accountLink");

// Bouton admin (caché sauf si admin)
const adminLink = document.getElementById("adminLink");

// ====== État de la page ======
// Catégorie active (par défaut: tous les produits)
let activeCategory = "all";

// Met à jour le texte du bouton panier en fonction du nombre d'articles
function updateCartButton() {
  const count = getCartCount(); // somme des quantités dans le panier
  cartBtn.textContent = count > 0 ? `Panier (${count})` : "Panier";
}

// Met à jour le lien compte (connecté ou pas) + affiche Admin si isAdmin
function updateAccountLink() {
  const session = getSession(); 

  // Si connecté -> "Mon compte", sinon -> "Se connecter"
  if (session) {
    accountLink.textContent = "Mon compte";
    accountLink.href = "account.html";
  } else {
    accountLink.textContent = "Se connecter";
    accountLink.href = "login.html";
  }

  // Afficher le bouton Admin uniquement si session.isAdmin === true
  if (adminLink) {
    adminLink.style.display = session?.isAdmin ? "inline-block" : "none";
  }
}

// Affiche les produits (tous ou filtrés par catégorie)
function renderProducts() {
  const { products } = getDB(); // récupère la DB depuis localStorage
  productsEl.innerHTML = "";    // vide l'affichage avant de rerender

  // Filtre selon la catégorie sélectionnée
  const filtered =
    activeCategory === "all"
      ? products
      : products.filter((p) => p.category === activeCategory);

  // Si aucun produit dans la catégorie -> message
  if (filtered.length === 0) {
    productsEl.innerHTML = `<p class="card">Aucun produit dans cette catégorie.</p>`;
    return;
  }

  // Construire une carte HTML par produit
  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    // On met les infos produit + lien vers la page produit + bouton ajouter
    // Le bouton stocke les infos du produit dans des data-attributes (dataset)
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>${p.price.toFixed(2)} €</p>
      <p>Stock: ${p.stock}</p>

      <a class="btn" href="product.html?id=${encodeURIComponent(p.id)}">Voir</a>

      <button class="btn add-to-cart-btn"
        data-id="${p.id}"
        data-name="${p.name}"
        data-price="${p.price}">
        Ajouter au panier
      </button>
    `;

    productsEl.appendChild(card);
  });
}

// ====== Event delegation ======
// Au lieu de mettre un addEventListener sur chaque bouton,
// on écoute un seul event sur le container.
// Ça marche même si on rerender la liste (ce que tu fais).
productsEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".add-to-cart-btn");
  if (!btn) return; // si on n'a pas cliqué sur un bouton add, on ignore

  // On reconstruit un objet produit depuis les data-attributes
  const product = {
    id: btn.dataset.id,
    name: btn.dataset.name,
    price: Number(btn.dataset.price),
  };

  // Ajout au panier (localStorage) + maj du compteur panier
  addToCart(product);
  updateCartButton();
});

// Installe les listeners sur les boutons catégories
function setupCategoryButtons() {
  document.querySelectorAll(".category-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      // On change l'état "activeCategory"
      activeCategory = btn.dataset.category;

      // Puis on rerender l'affichage avec le nouveau filtre
      renderProducts();
    });
  });
}

// ====== Initialisation ======
// 1) initDB : copie products.json vers localStorage si pas déjà fait
// 2) setupCategoryButtons : connecte tes boutons
// 3) renderProducts : affiche la liste
// 4) updateCartButton : affiche Panier(X)
// 5) updateAccountLink : affiche "Mon compte" / "Se connecter" + admin
await initDB();
setupCategoryButtons();
renderProducts();
updateCartButton();
updateAccountLink();
