import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import Profile from "./Profile";

class ProfileImage extends Model {
  public id!: number;
  public profileId!: number;
  public cloudinaryId!: string;
  public imageUrl!: string;
  public thumbnailUrl!: string;
  public width!: number;
  public height!: number;
  public format!: string;
  public bytes!: number;
  public isPrimary!: boolean;
  public order!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProfileImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Profile,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    cloudinaryId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    format: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bytes: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isPrimary: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: "ProfileImage",
    tableName: "profile_images",
    timestamps: true,
  }
);

// Set up associations
Profile.hasMany(ProfileImage, {
  foreignKey: "profileId",
  as: "images",
  onDelete: "CASCADE",
});

ProfileImage.belongsTo(Profile, {
  foreignKey: "profileId",
  as: "profile",
});

export default ProfileImage;
