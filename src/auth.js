// Simple auth state for Spacespot frontend
export function saveToken(token) {
  localStorage.setItem('spacespot_token', token);
}

export function getToken() {
  return localStorage.getItem('spacespot_token');
}

export function clearToken() {
  localStorage.removeItem('spacespot_token');
}
