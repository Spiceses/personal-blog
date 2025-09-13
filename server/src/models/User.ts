// src/models/User.ts

import mongoose, { Schema, Document, Model } from "mongoose";

// 步骤 1: 定义创建新用户时需要提供的属性 (Attributes Interface)
// 这个接口描述了一个纯粹的 JS 对象，用于创建新的用户文档。
export interface IUserAttrs {
  googleId: string;
  name: string;
  email: string;
  picture: string;
}

// 步骤 2: 定义用户文档的接口 (Document Interface)
// 这个接口包含了 IUserAttrs 的所有属性，并继承了 Mongoose 的 Document 类。
// 这意味着 IUserDocument 类型的对象将拥有 save(), toJSON() 等实例方法。
export interface IUserDocument extends IUserAttrs, Document {
  // 你可以在这里添加自定义的实例方法，例如：
  // getInitials(): string;

  // Mongoose 会自动添加 createdAt 和 updatedAt 字段，因为 schema 中设置了 timestamps: true
  createdAt: Date;
  updatedAt: Date;
}

// 步骤 3: 定义用户模型的接口 (Model Interface)
// 这个接口继承了 Mongoose 的 Model，并定义了我们自己的静态方法，比如 `build`。
// 这让我们可以用类型安全的方式来操作 User 这个集合。
export interface IUserModel extends Model<IUserDocument> {
  build(attrs: IUserAttrs): IUserDocument;
}

// 步骤 4: 创建 Mongoose Schema
const UserSchema = new Schema(
  {
    googleId: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    picture: {
      type: String, // URL to the user's Google profile picture
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        // 美化 toJSON 的输出，将 _id 转换为 id，并移除 __v
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

// 步骤 5: 在 Schema 上实现静态的 build 方法
UserSchema.statics.build = (attrs: IUserAttrs) => {
  return new User(attrs);
};

// 步骤 6: 创建 Model，并将我们的接口作为泛型传入
// mongoose.model<文档接口, 模型接口>("模型名称", schema)
const User = mongoose.model<IUserDocument, IUserModel>("User", UserSchema);

export default User;
