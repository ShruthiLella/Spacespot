import express from 'express';
import { units } from '../mockdb.js';

const router = express.Router();

function mockAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  next();
}

// Create units (bulk)
router.post('/', mockAuth, async (req, res) => {
  const newUnits = req.body.units.map((u, i) => ({ ...u, id: (units.length + i + 1) + '' }));
  units.push(...newUnits);
  res.json(newUnits);
});


// Get all units (no space filter, public)
router.get('/', async (req, res) => {
  res.json(units);
});

// Get all units for a space
router.get('/:spaceId', mockAuth, async (req, res) => {
  const { spaceId } = req.params;
  const filtered = units.filter(u => u.spaceId === spaceId);
  res.json(filtered);
});

export default router;
// Update a unit by ID
router.put('/:id', mockAuth, async (req, res) => {
  const { id } = req.params;
  const idx = units.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Unit not found' });
  units[idx] = { ...units[idx], ...req.body };
  res.json(units[idx]);
});

// Delete a unit by ID
router.delete('/:id', mockAuth, async (req, res) => {
  const { id } = req.params;
  const idx = units.findIndex(u => u.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Unit not found' });
  const deleted = units.splice(idx, 1)[0];
  res.json(deleted);
});
