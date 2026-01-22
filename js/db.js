// Clé utilisée dans localStorage pour stocker la "base de données" produits
const DB_KEY = "db_products";

// =========================
// Initialisation de la DB
// =========================
// Rôle :
// - Au premier chargement :
//   → copier products.json vers localStorage
// - Aux chargements suivants :
//   → ne RIEN faire (on garde les données modifiées)
export async function initDB() {
  const existing = localStorage.getItem(DB_KEY);

  // Si la DB existe déjà → on ne réécrit PAS
  if (existing) return JSON.parse(existing);

  // Sinon : on charge le fichier seed products.json
  const res = await fetch("./products.json");
  if (!res.ok) throw new Error("Impossible de charger products.json");

  const seed = await res.json();

  // On stocke les données dans localStorage
  localStorage.setItem(DB_KEY, JSON.stringify(seed));

  return seed;
}


// CRUD fonctions

// =========================
// Récupérer toute la DB
// =========================
export function getDB() {
  const raw = localStorage.getItem(DB_KEY);

  // Si jamais la DB n'existe pas → structure par défaut
  return raw ? JSON.parse(raw) : { products: [] };
}

// =========================
// Sauvegarder la DB
// =========================
// Fonction utilitaire appelée après CHAQUE modification
export function saveDB(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

// =========================
// Récupérer un produit par ID
// =========================
export function getProductById(id) {
  const db = getDB();

  // find() retourne undefined si non trouvé → on normalise en null
  return db.products.find((p) => p.id === id) || null;
}

// =========================
// Décrémenter le stock
// =========================
// Utilisé lors de la validation du panier
export function decreaseStock(id, qty) {
  const db = getDB();

  // On cherche le produit
  const p = db.products.find((x) => x.id === id);
  if (!p) return false;        // produit inexistant
  if (p.stock < qty) return false; // stock insuffisant

  // Décrémentation
  p.stock -= qty;

  // Si stock à 0 → on SUPPRIME le produit de la DB
  if (p.stock <= 0) {
    db.products = db.products.filter((x) => x.id !== id);
  }

  // Sauvegarde de la DB mise à jour
  saveDB(db);

  return true;
}

// =========================
// Ajouter un produit (ADMIN)
// =========================
export function addProduct(product) {
  const db = getDB();

  // Sécurité : ID unique obligatoire
  if (db.products.some((p) => p.id === product.id)) {
    throw new Error("ID déjà utilisé");
  }

  db.products.push(product);
  saveDB(db);

  return product;
}

// =========================
// Modifier un produit (ADMIN)
// =========================
export function updateProduct(id, patch) {
  const db = getDB();

  // Recherche du produit
  const p = db.products.find((x) => x.id === id);
  if (!p) throw new Error("Produit introuvable");

  // Mise à jour partielle (patch)
  Object.assign(p, patch);

  saveDB(db);

  return p;
}

// =========================
// Supprimer un produit (ADMIN)
// =========================
export function deleteProduct(id) {
  const db = getDB();

  // On enlève le produit de la liste
  db.products = db.products.filter((p) => p.id !== id);

  saveDB(db);
}
