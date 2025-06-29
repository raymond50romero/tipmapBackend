import { DataTypes } from 'sequelize';
import { sequelize } from './connect.js';

export const occupation = sequelize.define(
  'occupation',
  {
    occupation_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id_link: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    bartender: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    busser: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    host: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    takeout: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    server: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    support: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    management: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    boh: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
    other: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: true,
    },
  },
  {
    underscored: true,
    freezeTableName: true,
    tableName: 'occupation',
  }
);
