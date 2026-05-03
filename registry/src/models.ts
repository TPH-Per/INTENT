import { Sequelize, DataTypes, Model } from 'sequelize';
import { FIS } from '@intent/core';

export class FISModel extends Model {}

export function initModels(sequelize: Sequelize) {
  FISModel.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    owner: DataTypes.STRING,
    statement_nl: DataTypes.TEXT,
    scope: DataTypes.JSONB,
    criteria: DataTypes.JSONB,
    thresholds: DataTypes.JSONB,
    priority: DataTypes.STRING,
    timeHorizon: DataTypes.STRING,
    deadline: DataTypes.DATE,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'active',
    },
  }, {
    sequelize,
    modelName: 'FIS',
    tableName: 'intents',
  });
}
