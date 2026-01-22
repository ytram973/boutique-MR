// ====== Imports ======
// Panier : lire, supprimer un article, vider le panier
import { getCart, removeFromCart, clearCart } from "./cart.js";

// DB produits : initialisation + décrément du stock
import { initDB, decreaseStock } from "./db.js";

// ====== Références DOM ======
// Conteneur qui affiche les items du panier
const cartItemsEl = document.getElementById("cartItems");

// Élément qui affiche le total du panier
const cartTotalEl = document.getElementById("cartTotal");

// Bouton "Vider le panier"
const clearBtn = document.getElementById("clearCartBtn");

// Bouton "Valider le panier"
const checkoutBtn = document.getElementById("checkoutBtn");

// ====== Rendu du panier ======
function renderCart() {
  // Récupère le panier depuis localStorage
  const cart = getCart();

  // Si panier vide → message + reset du total
  if (cart.length === 0) {
    cartItemsEl.innerHTML = `<p class="card">Panier vide.</p>`;
    cartTotalEl.textContent = "";
    return;
  }

  // Nettoie l'affichage avant rerender
  cartItemsEl.innerHTML = "";

  let total = 0;

  // Pour chaque article du panier
  cart.forEach((item) => {
    // Calcul du total (prix * quantité)
    total += item.price * item.qty;

    // Création d'une carte HTML pour l'article
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p>Prix : ${item.price.toFixed(2)} €</p>
      <p>Quantité : ${item.qty}</p>
      <button class="btn" type="button" data-id="${item.id}">
        Supprimer
      </button>
    `;

    // Bouton supprimer un article du panier
    card.querySelector("button").addEventListener("click", () => {
      removeFromCart(item.id); // supprime l'article du panier
      renderCart();            // rerender immédiat
    });

    cartItemsEl.appendChild(card);
  });

  // Affiche le total final
  cartTotalEl.textContent = `Total : ${total.toFixed(2)} €`;
}

// ====== Bouton "Vider le panier" ======
clearBtn.addEventListener("click", () => {
  clearCart();   // supprime tout le panier (localStorage)
  renderCart();  // met à jour l'affichage
});

// ====== Bouton "Valider le panier" ======
checkoutBtn.addEventListener("click", async () => {
  // Initialise la DB (au cas où ce n'est pas encore fait)
  await initDB();

  const cart = getCart();

  // Sécurité : panier vide → stop
  if (cart.length === 0) {
    alert("Panier vide.");
    return;
  }

  // Vérifier le stock + décrémenter
  // Si un seul produit n'a pas assez de stock → on annule tout
  for (const item of cart) {
    const ok = decreaseStock(item.id, item.qty);
    if (!ok) {
      alert(`Stock insuffisant pour ${item.name}`);
      return;
    }
  }

  // Panier validé → on vide le panier
  clearCart();

  // Feedback utilisateur
  alert("Commande validée ✅ (stock mis à jour)");

  // Redirection vers l'accueil
  window.location.href = "index.html";
});

// ====== Initial render ======
renderCart();
