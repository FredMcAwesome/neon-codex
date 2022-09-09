import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../utils/db.js";

class ThreadModel extends Model<
  InferAttributes<ThreadModel>,
  InferCreationAttributes<ThreadModel>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare userId: ForeignKey<number>;
}

ThreadModel.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "thread" }
);

export default ThreadModel;
