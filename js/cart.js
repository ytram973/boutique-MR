// Clé utilisée dans localStorage pour stocker le panier
const CART_KEY = "cart";

// =========================
// Récupérer le panier
// =========================
export function getCart() {
  const raw = localStorage.getItem(CART_KEY);

  // Si aucun panier stocké → panier vide
  if (!raw) return [];

  try {
    const cart = JSON.parse(raw);

    // Sécurité : on s'assure que c'est bien un tableau
    return Array.isArray(cart) ? cart : [];
  } catch {
    // Si JSON corrompu → panier vide
    return [];
  }
}

// =========================
// Sauvegarder le panier
// =========================
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// =========================
// Ajouter un produit au panier
// =========================
export function addToCart(product) {
  const cart = getCart();

  // Vérifie si le produit est déjà dans le panier
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    // Si oui → on incrémente la quantité
    existing.qty += 1;
  } else {
    // Sinon → on ajoute le produit avec qty = 1
    cart.push({ ...product, qty: 1 });
  }

  // Sauvegarde dans localStorage
  saveCart(cart);

  return cart;
}

// =========================
// Supprimer un produit du panier
// =========================
export function removeFromCart(id) {
  // On filtre le panier pour enlever le produit ciblé
  const cart = getCart().filter((item) => item.id !== id);

  // Sauvegarde du nouveau panier
  saveCart(cart);

  return cart;
}

// =========================
// Vider complètement le panier
// =========================
export function clearCart() {
  localStorage.removeItem(CART_KEY);
}

// =========================
// Compter le nombre total d'articles
// =========================
export function getCartCount() {
  return getCart().reduce(
    (sum, item) => sum + (item.qty || 0),
    0
  );
}
