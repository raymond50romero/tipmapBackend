import { DataTypes } from "sequelize";
import { sequelize } from "./connect.js";

export const avgPosts = sequelize.define(
  "average_posts",
  {
    average_post_id: {
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
    weekday_tips_average: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: { min: -5, max: 5 },
    },
    weekday_tips_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weekend_tips_average: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: { min: -5, max: 5 },
    },
    weekend_tips_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    work_environment_average: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: { min: -5, max: 5 },
    },
    work_environment_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    management_average: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: { min: -5, max: 5 },
    },
    management_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientele_average: {
      type: DataTypes.DECIMAL(9, 6),
      allowNull: false,
      validate: { min: -5, max: 5 },
    },
    clientele_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "average_posts",
  },
);
