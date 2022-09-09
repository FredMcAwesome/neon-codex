import ThreadModel from "./threadModel.js";
import UserModel from "./userModel.js";
import CommentModel from "./commentModel.js";

// define relationships
UserModel.hasMany(ThreadModel);
ThreadModel.belongsTo(UserModel);

ThreadModel.hasMany(CommentModel);
CommentModel.belongsTo(ThreadModel);
UserModel.hasMany(CommentModel);
CommentModel.belongsTo(UserModel);

// creates tables if they do not exist
await UserModel.sync();
await ThreadModel.sync();
await CommentModel.sync();

export { UserModel as User, ThreadModel as Thread, CommentModel as Comment };
