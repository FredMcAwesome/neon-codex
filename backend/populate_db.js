import { exit } from "process";
import { Sequelize, Model, DataTypes } from "sequelize";

const dbName = "shadowrun";
const username = "postgres";
const password = "postgres";
const host = "localhost";

const conStringPost =
  "postgres://" + username + ":" + password + "@" + host + "/" + dbName;

const sequelize = new Sequelize(conStringPost);

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(3000),
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "user" }
);

// creates table if does not exist
await User.sync();

await User.create({ username: "test1", password: "test1" }).catch((error) => {
  console.log(error);
  exit();
});

class Thread extends Model {}
Thread.init(
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

// creates table if does not exist
await Thread.sync();

User.hasMany(Thread);
Thread.belongsTo(User);
await User.sync({ alter: true });
await Thread.sync({ alter: true });

const user = await User.findOne();
await Thread.create({ title: "test1", userId: user.id }).catch((error) => {
  console.log(error);
  exit();
});

class Comment extends Model {}
Comment.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING(1000),
    },
  },
  { sequelize, underscored: true, timestamps: false, modelName: "comment" }
);

// creates table if does not exist
await Comment.sync();

User.hasMany(Comment);
Thread.hasMany(Comment);
Comment.belongsTo(User);
Comment.belongsTo(Thread);
await User.sync({ alter: true });
await Thread.sync({ alter: true });
await Comment.sync({ alter: true });

const thread = await Thread.findOne();
await Comment.create({
  title: "title test1",
  userId: user.id,
  threadId: thread.id,
  content: "content test1",
}).catch((error) => {
  console.log(error);
  exit();
});

sequelize.close();
