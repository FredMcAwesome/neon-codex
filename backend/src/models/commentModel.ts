import {
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  ForeignKey,
} from "sequelize";
import { sequelize } from "../utils/db.js";

class CommentModel extends Model<
  InferAttributes<CommentModel>,
  InferCreationAttributes<CommentModel>
> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare content: string;
  declare userId: ForeignKey<number>;
  declare threadId: ForeignKey<number>;
}

CommentModel.init(
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
    content: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "thread" }
);

export default CommentModel;
