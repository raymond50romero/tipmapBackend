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
    mapbox_id: {
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
    overall_average: {
      type: DataTypes.VIRTUAL,
      get() {
        const w = { tips: 0.26, other: 0.16 };
        const score =
          this.weekday_tips_average * w.tips +
          this.weekend_tips_average * w.tips +
          this.work_environment_average * w.other +
          this.management_average * w.other +
          this.clientele_average * w.other;

        return parseFloat(score.toFixed(2));
      },
      set(value) {
        throw new Error("Do not try to set the overall_rating value! ", value);
      },
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
