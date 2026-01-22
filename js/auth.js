const SESSION_KEY = "session";

// Récupère la session depuis localStorage.

export function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw);
    // Petite validation minimale 
    if (!session?.email) return null;
    return session;
  } catch {
    return null;
  }
}

// Crée / met à jour la session.
export function setSession({ email, isAdmin = false }) {
  const session = {
    email: String(email).trim().toLowerCase(),
    isAdmin: Boolean(isAdmin),
    ts: Date.now(),
  };

  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return session;
}

// Supprime la session (logout).
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Page accessible uniquement si connecté.
// Si pas connecté -> redirection login.
export function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

// Page accessible uniquement si admin.
// Si pas connecté -> login.
// Si connecté mais pas admin -> index.
export function requireAdmin() {
  const session = getSession();

  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  if (!session.isAdmin) {
    window.location.href = "index.html";
    return null;
  }

  return session;
}
