import { DataTypes } from "sequelize";
import { sequelize } from "./connect.js";

export const weights = sequelize.define(
  "weights",
  {
    weight_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: { min: -180, max: 180 },
    },
    latitude: {
      type: DataTypes.DECIMAL(8, 6),
      allowNull: false,
      validate: { min: -90, max: 90 },
    },
    weekday_tips_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weekend_tips_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    work_environment_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    management_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientele_weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "weights",
  },
);
