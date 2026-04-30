// API utility for Spacespot frontend to connect to backend
const API_URL = 'http://localhost:4000/api';

export async function signup({ email, password, name }) {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name })
  });
  return res.json();
}

export async function login({ email, password }) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function getMe(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function createUnits(units, token) {
  const res = await fetch(`${API_URL}/units`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ units })
  });
  return res.json();
}

export async function getUnits(spaceId, token) {
  const res = await fetch(`${API_URL}/units/${spaceId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function getAllUnits(token) {
  const res = await fetch(`${API_URL}/units`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}

export async function uploadFile(file, token) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_URL}/files/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form
  });
  return res.json();
}

export async function updateUnit(id, data, token) {
  const res = await fetch(`${API_URL}/units/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function deleteUnit(id, token) {
  const res = await fetch(`${API_URL}/units/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
}
