// Example React hook for Spacespot API usage
import { useState } from 'react';
import * as api from './api';
import { saveToken, getToken, clearToken } from './auth';

export function useSpacespotDemo() {
  const [user, setUser] = useState(null);
  const [units, setUnits] = useState([]);
  const [token, setToken] = useState(getToken());
  const [error, setError] = useState('');

  async function signup(email, password, name) {
    const res = await api.signup({ email, password, name });
    if (res.error) setError(res.error);
    else setError('');
  }

  async function login(email, password) {
    const res = await api.login({ email, password });
    if (res.token) {
      saveToken(res.token);
      setToken(res.token);
      setError('');
      setUser(res.user);
    } else {
      setError(res.error || 'Login failed');
    }
  }

  async function fetchMe() {
    const res = await api.getMe(token);
    if (res.id) setUser(res);
    else setError(res.error || 'Not logged in');
  }

  async function createDemoUnits(spaceId) {
    const demoUnits = [
      { name: 'Unit 101', floor: 'Level 1', type: 'Office', area: '100', status: 'Available', spaceId },
      { name: 'Unit 102', floor: 'Level 1', type: 'Office', area: '120', status: 'Available', spaceId }
    ];
    const res = await api.createUnits(demoUnits, token);
    setUnits(res);
  }

  async function fetchUnits(spaceId) {
    const res = await api.getUnits(spaceId, token);
    setUnits(res);
  }

  async function uploadDemoFile(file) {
    const res = await api.uploadFile(file, token);
    return res.url;
  }

  async function updateUnit(id, data) {
    const res = await api.updateUnit(id, data, token);
    // Update local state
    setUnits(units => units.map(u => u.id === id ? res : u));
  }

  async function deleteUnit(id) {
    const res = await api.deleteUnit(id, token);
    // Remove from local state
    setUnits(units => units.filter(u => u.id !== id));
  }

  function logout() {
    clearToken();
    setToken(null);
    setUser(null);
    setUnits([]);
  }

  return { user, units, token, error, signup, login, fetchMe, createDemoUnits, fetchUnits, uploadDemoFile, logout, updateUnit, deleteUnit };
}
