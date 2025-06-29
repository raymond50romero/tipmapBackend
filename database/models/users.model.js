import { DataTypes } from 'sequelize';
import { sequelize } from './connect.js';

export const user = sequelize.define(
  'users',
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: 'users',
  }
);
