// ====== Imports ======
// requireAdmin : bloque l'accès si pas admin
// clearSession : logout
import { requireAdmin, clearSession } from "./auth.js";

// initDB : seed products.json -> localStorage (1ère fois)
// getDB : lire les produits
// add/update/delete : CRUD produits (admin)
import { initDB, getDB, addProduct, updateProduct, deleteProduct } from "./db.js";


// Stoppe l'accès si pas admin (redirige automatiquement)
requireAdmin();

// S'assure que la DB existe dans localStorage avant de travailler
await initDB();

// ====== Références DOM ======
const listEl = document.getElementById("adminProducts");
const form = document.getElementById("productForm");
const msg = document.getElementById("msg");

const idEl = document.getElementById("id");
const nameEl = document.getElementById("name");
const priceEl = document.getElementById("price");
const imageEl = document.getElementById("image");
const descEl = document.getElementById("description");
const stockEl = document.getElementById("stock");
const categoryEl = document.getElementById("category");

// ====== État ======
// Si null => on crée un produit
// Si contient un id => on modifie ce produit
let editingId = null;

// Affiche un message (erreur ou info)
function setMessage(text, isError = false) {
  msg.textContent = text;
  msg.style.color = isError ? "#b00020" : "#333";
}

// Reset le form + repasse en mode création
function resetForm() {
  editingId = null;
  form.reset();
  idEl.disabled = false; // on peut saisir un nouvel ID
  setMessage("");
}

// Rendu de la liste produits dans l'admin
function render() {
  const { products } = getDB();
  listEl.innerHTML = "";

  products.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h3>${p.name}</h3>
      <p><b>ID:</b> ${p.id}</p>
      <p><b>Prix:</b> ${Number(p.price).toFixed(2)} €</p>
      <p><b>Stock:</b> ${p.stock}</p>
      <p><b>Catégorie:</b> ${p.category || "-"}</p>

      <div style="display:flex; gap:12px; flex-wrap:wrap;">
        <button class="btn" data-action="edit" data-id="${p.id}" type="button">Modifier</button>
        <button class="btn" data-action="delete" data-id="${p.id}" type="button">Supprimer</button>
      </div>
    `;

    listEl.appendChild(card);
  });
}

// ====== Actions sur la liste (event delegation) ======
listEl.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const action = btn.dataset.action;
  const id = btn.dataset.id;

  // Supprimer un produit
  if (action === "delete") {
    deleteProduct(id);
    render();
    resetForm();
    setMessage("Produit supprimé ✅");
    return;
  }

  // Charger un produit en mode édition
  if (action === "edit") {
    const p = getDB().products.find((x) => x.id === id);
    if (!p) return;

    editingId = id;

    // ID non modifiable (évite incohérences)
    idEl.value = p.id;
    idEl.disabled = true;

    // Remplir les champs
    nameEl.value = p.name;
    priceEl.value = p.price;
    imageEl.value = p.image;
    descEl.value = p.description;
    stockEl.value = p.stock;

    categoryEl.value = p.category || "";

    setMessage("Mode édition ✏️");
  }
});

// ====== Submit form (Create/Update) ======
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Construire l'objet produit depuis les inputs
  const product = {
    id: idEl.value.trim(),
    name: nameEl.value.trim(),
    price: Number(priceEl.value),
    image: imageEl.value.trim(),
    description: descEl.value.trim(),
    stock: Number(stockEl.value),
    category: categoryEl.value.trim().toLowerCase(),
  };

  try {
    // ====== Validations (propre) ======

    // Textes obligatoires
    if (!product.id || !product.name || !product.image || !product.description ) {
      setMessage("Champs texte invalides.", true);
      return;
    }

    // Catégorie obligatoire (sinon ton filtre index casse)
    if (!product.category) {
      setMessage("Catégorie requise (ex: chaussure, vetement).", true);
      return;
    }

    // Prix : nombre >= 0
    if (!Number.isFinite(product.price) || product.price < 0) {
      setMessage("Le prix doit être un nombre >= 0.", true);
      return;
    }

    // Stock : entier >= 0
    if (!Number.isFinite(product.stock) || product.stock < 0 || !Number.isInteger(product.stock)) {
      setMessage("Le stock doit être un entier >= 0.", true);
      return;
    }

    // ====== Create / Update ======
    if (editingId) {
      updateProduct(editingId, product);
      setMessage("Produit modifié ✅");
    } else {
      addProduct(product);
      setMessage("Produit ajouté ✅");
    }

    // Rerender + reset
    render();
    resetForm();
  } catch (err) {
    setMessage(err.message || "Erreur", true);
  }
});

// Reset bouton
document.getElementById("resetBtn").addEventListener("click", resetForm);

// Logout admin
document.getElementById("logoutBtn").addEventListener("click", () => {
  clearSession();
  window.location.href = "index.html";
});

// Premier rendu
render();
