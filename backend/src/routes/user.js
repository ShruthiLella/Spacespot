import express from 'express';
import { User } from '../models/index.js';
import jwt from 'jsonwebtoken';
import { users } from '../mockdb.js';

const router = express.Router();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
}

function mockAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  const id = auth.replace('Bearer mocktoken-', '');
  req.user = users.find(u => u.id === id);
  if (!req.user) return res.status(401).json({ error: 'Invalid token' });
  next();
}

router.get('/me', mockAuth, async (req, res) => {
  const user = req.user;
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name, role: user.role });
});

export default router;
