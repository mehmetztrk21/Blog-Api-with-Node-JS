"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getBlogs = void 0;
const blog_1 = require("../models/blog");
const category_1 = require("../models/category");
const comment_1 = require("../models/comment");
const getBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_1.Blog.findAll({ include: [comment_1.Comment, { model: category_1.Category, through: { attributes: [] } }] });
        return res.status(200).json({ message: "getting success", blogs: blogs });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getBlogs = getBlogs;
const createBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.imageUrl;
    try {
        yield blog_1.Blog.create(Object.assign(Object.assign({}, body), { writerId: 1 }));
    }
    catch (err) {
        console.log(err);
    }
    return res.status(201).json("created");
});
exports.createBlog = createBlog;
const updateBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const blogId = req.params.blogId;
    try {
        const blog = yield blog_1.Blog.findByPk(blogId);
        yield (blog === null || blog === void 0 ? void 0 : blog.update(Object.assign({}, body)));
        yield (blog === null || blog === void 0 ? void 0 : blog.save());
        return res.status(201).json({ message: "updated", id: blogId });
    }
    catch (error) {
        console.log("ERROR:", error);
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.blogId;
    try {
        const blog = yield blog_1.Blog.findByPk(req.params.blogId);
        yield (blog === null || blog === void 0 ? void 0 : blog.destroy());
        return res.status(204).json({ message: "deleted", id: blogId });
    }
    catch (error) {
        console.log(error);
    }
});
exports.deleteBlog = deleteBlog;
