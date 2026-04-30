import express from 'express';
import { users } from '../mockdb.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body;
  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ error: 'Email already in use' });
  const hash = password + '_hash'; // mock hash
  const user = { id: users.length + 1 + '', email, password: hash, name, role: 'user' };
  users.push(user);
  res.json({ id: user.id, email: user.email, name: user.name });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  if (user.password !== password + '_hash') return res.status(400).json({ error: 'Invalid credentials' });
  const token = 'mocktoken-' + user.id;
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});

export default router;
