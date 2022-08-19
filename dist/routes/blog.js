"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const blog_1 = require("../controller/blog");
exports.router = (0, express_1.Router)();
exports.router.get("/", blog_1.getBlogs);
exports.router.post("/", blog_1.createBlog);
exports.router.put("/:blogId", blog_1.updateBlog);
exports.router.delete("/:blogId", blog_1.deleteBlog);