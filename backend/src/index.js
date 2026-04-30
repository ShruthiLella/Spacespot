import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import unitRoutes from './routes/unit.js';
import fileRoutes from './routes/file.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/units', unitRoutes);
app.use('/api/files', fileRoutes);

app.get('/', (req, res) => res.send('Spacespot backend running'));

const PORT = process.env.PORT || 4000;

// Remove sequelize.sync().then(() => {
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
// });
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
