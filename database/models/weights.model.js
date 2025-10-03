import { DataTypes } from "sequelize";
import { sequelize } from "./connect.js";

export const posts = sequelize.define(
  "posts",
  {
    post_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id_link: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    restaurant_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurant_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurant_city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    restaurant_state: {
      type: DataTypes.STRING,
      allowNull: false,
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
    weekday_tips: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weekend_tips: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    work_environment: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    management: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    clientele: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    comment: {
      type: DataTypes.TEXT("medium"),
      allowNull: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    tableName: "posts",
  },
);
