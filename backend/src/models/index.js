import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { initUserModel } from './user.js';
import { initUnitModel } from './unit.js';
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
);

export const User = initUserModel(sequelize);
export const Unit = initUnitModel(sequelize);
