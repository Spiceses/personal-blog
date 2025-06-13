import mongoose, { Schema, Document } from "mongoose";

import slugify from "slugify";

export interface IPost extends Document {
  title: string;
  slug: string;
  markdownContent: string;
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "标题不能为空"],
      trim: true,
      maxLength: [150, "标题不能超过150个字符"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    markdownContent: { type: String, required: [true, "post内容不能为空"] },
  },
  { timestamps: true }
);

PostSchema.pre<IPost>("save", function (next) {
  if ((this.isModified("title") || this.isNew) && this.title) {
    this.slug = slugify.default(this.title, {
      lower: true,
      strict: true,
      replacement: "-",
      remove: /[*+~.()'"!:@]/g,
    });
  }
  next();
});

const Post = mongoose.model<IPost>("Post", PostSchema);

export default Post;
