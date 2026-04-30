import { DataTypes, Model } from 'sequelize';

export function initUnitModel(sequelize) {
  class Unit extends Model {}
  Unit.init({
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    unitId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING, allowNull: false },
    unitNumber: { type: DataTypes.STRING },
    unitCategory: { type: DataTypes.STRING },
    floor: { type: DataTypes.STRING },
    precinct: { type: DataTypes.STRING },
    unitDescription: { type: DataTypes.TEXT },
    unitArea: { type: DataTypes.STRING },
    unitAreaUnit: { type: DataTypes.STRING },
    unitHeight: { type: DataTypes.STRING },
    unitWidth: { type: DataTypes.STRING },
    unitLength: { type: DataTypes.STRING },
    unitDepth: { type: DataTypes.STRING },
    unitFeatures: { type: DataTypes.STRING }, // CSV string or JSON
    unitStatus: { type: DataTypes.STRING },
    unitBasePrice: { type: DataTypes.STRING },
    availableFrom: { type: DataTypes.STRING },
    availableTo: { type: DataTypes.STRING },
    specialConditions: { type: DataTypes.TEXT },
    expectedFootTraffic: { type: DataTypes.STRING },
    unitImages: { type: DataTypes.STRING }, // CSV string or JSON
    spaceId: { type: DataTypes.STRING },
  }, {
    sequelize,
    modelName: 'Unit',
  });
  return Unit;
}
