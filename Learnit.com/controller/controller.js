const userModel = require("../model/userModel.js");
const bcrypt = require("bcryptjs");
const blogModel = require("../model/blogModel.js");
const fs = require("fs");
const path = require("path");

const showLogin = (req, res) => {
  res.render("login");
};

const showRegister = (req, res) => {
  res.render("register");
};

const showHome = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const blogs = await blogModel
      .find({ author: userId })
      .sort({ createdAt: -1 });
    res.render("home", { blogs });
  } catch (error) {
    console.log(error);
  }
};

const showAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel
      .find({ published: true })
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.render("allBlogs", { blogs });
  } catch (error) {
    console.log(error);
  }
};

const showBlogDetails = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel
      .findById(blogId)
      .populate("author", "username bio");

    if (!blog) {
      return res.redirect("/user/allBlogs");
    }

    res.render("blogDetails", { blog });
  } catch (error) {
    console.log(error);
    res.redirect("/user/allBlogs");
  }
};

const register = async (req, res) => {
  const { username, email, password, bio } = req.body;
  const hashPass = await bcrypt.hash(password, 10);
  try {
    await userModel.create({ username, email, bio, password: hashPass });
    res.redirect("/user/login");
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({ username });
  try {
    if (user) {
      if (await bcrypt.compare(password, user.password)) {
        req.session.user = user;
        res.redirect("/user/home");
      } else {
        res.redirect("/user/login");
      }
    } else {
      res.redirect("/user/login");
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/user/login");
    }
  });
};

const createBlog = async (req, res) => {
  const { title, content, summary, tags, imageUrl } = req.body;
  const published = req.body.published === "on";
  const author = req.session.user._id;
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

  try {
    const blogData = {
      title,
      content,
      summary,
      author,
      tags: tagArray,
      published,
    };

    // If imageUrl is provided, store it
    if (imageUrl) {
      blogData.image = {
        url: imageUrl,
      };
    }

    await blogModel.create(blogData);
    res.redirect("/user/home");
  } catch (error) {
    console.log(error);
  }
};

const updateBlogStatus = async (req, res) => {
  const id = req.body.id;
  try {
    await blogModel.findByIdAndUpdate({ _id: id }, { published: true });
    res.redirect("/user/home");
  } catch (error) {
    console.log(error);
  }
};

const editBlogForm = async (req, res) => {
  try {
    const blogId = req.params.id;
    const blog = await blogModel.findById(blogId);

    if (!blog || blog.author.toString() !== req.session.user._id.toString()) {
      return res.redirect("/user/home");
    }

    res.render("editBlog", { blog });
  } catch (error) {
    console.log(error);
    res.redirect("/user/home");
  }
};

const updateBlog = async (req, res) => {
  const { id, title, content, summary, tags, imageUrl } = req.body;
  const published = req.body.published === "on";
  const tagArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];

  try {
    const blog = await blogModel.findById(id);

    if (!blog || blog.author.toString() !== req.session.user._id.toString()) {
      return res.redirect("/user/home");
    }

    const updateData = {
      title,
      content,
      summary,
      tags: tagArray,
      published,
      updatedAt: Date.now(),
    };

    // If new imageUrl is provided, update the image info
    if (imageUrl) {
      updateData.image = {
        url: imageUrl,
      };
      // We are no longer handling file uploads, so no need to delete old files
    }

    await blogModel.findByIdAndUpdate(id, updateData);
    res.redirect("/user/home");
  } catch (error) {
    console.log(error);
  }
};

const deleteBlog = async (req, res) => {
  const id = req.body.id;
  try {
    const blog = await blogModel.findById(id);

    if (!blog || blog.author.toString() !== req.session.user._id.toString()) {
      return res.redirect("/user/home");
    }


    await blogModel.findByIdAndDelete(id);
    res.redirect("/user/home");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  showHome,
  showLogin,
  showRegister,
  register,
  login,
  logout,
  createBlog,
  updateBlogStatus,
  deleteBlog,
  showAllBlogs,
  showBlogDetails,
  editBlogForm,
  updateBlog,
};
