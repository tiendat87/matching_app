import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class Profile extends Model {
  public id!: number;
  public displayName!: string;
  public birthdate!: Date;
  public gender!: string;
  public lookingFor!: string;
  public lookingForAgeMin!: number;
  public lookingForAgeMax!: number;
  public city!: string;
  public federalState!: string;
  public phoneNumber!: string;
  public facebookProfile?: string;
  public interests!: string[];
  public bio?: string;
  public email!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Profile.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    displayName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    birthdate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: false,
    },
    lookingFor: {
      type: DataTypes.ENUM("male", "female", "both"),
      allowNull: false,
    },
    lookingForAgeMin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 18,
        max: 75,
      },
    },
    lookingForAgeMax: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 18,
        max: 75,
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    federalState: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^(\+49|0049|0)?[1-9]\d{1,14}$/, // German phone number format
      },
    },
    facebookProfile: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrl: true,
        contains: "facebook.com",
      },
    },
    interests: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: "Profile",
    tableName: "profiles",
    timestamps: true,
  }
);

export default Profile;
