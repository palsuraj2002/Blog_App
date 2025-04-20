const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  summary: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  published: { type: Boolean, default: true },
  image: {
    url: { type: String },
  },
});

const blogModel = mongoose.model("blog", blogSchema);

module.exports = blogModel;
