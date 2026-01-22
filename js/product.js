// On initialise la mini base (seed JSON -> localStorage) et on récupère un produit par id
import { initDB, getProductById } from "./db.js";

// Panier : ajouter un produit + afficher le compteur dans le bouton panier
import { addToCart, getCartCount } from "./cart.js";

// ====== Références DOM ======
// Conteneur dans lequel on affiche le produit (injection HTML)
const productEl = document.getElementById("product");

// Bouton/lien panier dans le header
const cartBtn = document.getElementById("cartBtn");

// Met à jour l'affichage du bouton panier: "Panier" "
function updateCartButton() {
  if (!cartBtn) return;
  const count = getCartCount();
  cartBtn.textContent = count > 0 ? `Panier (${count})` : "Panier";
}

// Récupère l'id dans l'URL: product.html?id=aj4 -> "aj4"
function getIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

// ====== Initialisation DB ======
// Important: sans ça, getProductById peut ne rien trouver (DB pas encore seedée)
await initDB();

// Garde: si ce script est chargé sur une mauvaise page,
// productEl sera null -> on évite de casser toute la page
if (!productEl) {
  updateCartButton();
} else {
  // 1) Récupère l'id depuis l'URL
  const id = getIdFromUrl();

  // 2) Récupère le produit dans la DB localStorage
  const p = getProductById(id);

  // 3) Si l'id est absent ou inconnu -> message
  if (!p) {
    productEl.innerHTML = `<p>Produit introuvable.</p>`;
  } else {
    // 4) Affiche le produit: image à gauche, infos à droite
    productEl.innerHTML = `
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}">
      </div>

      <div class="product-info">
        <h1>${p.name}</h1>
        <p class="price">${p.price.toFixed(2)} €</p>
        <p class="description">${p.description}</p>
        <p>Stock : <b>${p.stock}</b></p>

        <!-- bouton désactivé si stock <= 0 -->
        <button class="btn" id="addBtn" ${p.stock <= 0 ? "disabled" : ""}>
          Ajouter au panier
        </button>
      </div>
    `;

    // 5) Click sur "Ajouter au panier"
    // On ajoute seulement les infos utiles au panier (id, name, price)
    document.getElementById("addBtn").addEventListener("click", () => {
      addToCart({ id: p.id, name: p.name, price: p.price });
      updateCartButton(); // met à jour le compteur immédiatement
    });
  }

  // Toujours mettre à jour le panier après le render
  updateCartButton();
}
