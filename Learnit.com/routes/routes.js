const express = require("express");
const {
  showLogin,
  showRegister,
  showHome,
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
} = require("../controller/controller.js");
const upload = require("../config/multerConfig.js");

const router = express.Router();

// Authentication routes
router.get("/", showLogin);
router.get("/login", showLogin);
router.get("/register", showRegister);
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout);

// Blog routes
router.get("/home", showHome);
router.get("/allBlogs", showAllBlogs);
router.get("/blog/:id", showBlogDetails);
router.get("/blog/edit/:id", editBlogForm);

// Blog actions with file upload
router.post("/create", upload.none(), createBlog); // Use upload.none() as we expect imageUrl in the body
router.post("/update", updateBlogStatus);
router.get("/edit/:id", editBlogForm);
router.post("/updateBlog", upload.none(), updateBlog); // Use upload.none() as we expect imageUrl in the body
router.post("/delete", deleteBlog);

module.exports = router;
