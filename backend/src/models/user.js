import { DataTypes, Model } from 'sequelize';

export function initUserModel(sequelize) {
  class User extends Model {}
  User.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
}
