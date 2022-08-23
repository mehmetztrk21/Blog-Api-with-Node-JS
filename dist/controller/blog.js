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
const server_error_1 = require("../utils/server-error");
const getBlogs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const blogs = yield blog_1.Blog.findAll({ include: [comment_1.Comment, { model: category_1.Category, through: { attributes: [] } }] });
        return res.status(200).json({ message: "getting success", blogs: blogs });
    }
    catch (err) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.getBlogs = getBlogs;
const createBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.session, req.headers);
    const userId = req.session.userId;
    const categories = req.body.categories;
    const body = req.body;
    try {
        const blog = yield blog_1.Blog.create(Object.assign(Object.assign({}, body), { writerId: userId }));
        if (categories.length > 0)
            yield (blog === null || blog === void 0 ? void 0 : blog.setCategories(categories));
        yield (blog === null || blog === void 0 ? void 0 : blog.save());
    }
    catch (err) {
        return (0, server_error_1.serverError)(next);
    }
    return res.status(201).json("created");
});
exports.createBlog = createBlog;
const updateBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const body = req.body;
    const blogId = req.params.blogId;
    const categories = req.body.categories;
    try {
        const blog = yield blog_1.Blog.findByPk(blogId);
        if (blog) {
            if (blog.writerId == userId) {
                yield (blog === null || blog === void 0 ? void 0 : blog.update(Object.assign({}, body)));
                if (categories.length > 0)
                    yield (blog === null || blog === void 0 ? void 0 : blog.setCategories(categories));
                yield (blog === null || blog === void 0 ? void 0 : blog.save());
                return res.status(204).json({ message: "updated", id: blogId });
            }
            return res.status(401).json({ message: "Not authenticated." });
        }
        return res.status(404).json({ message: "Blog not found" });
    }
    catch (err) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.updateBlog = updateBlog;
const deleteBlog = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.blogId;
    const userId = req.session.userId;
    try {
        const blog = yield blog_1.Blog.findByPk(req.params.blogId);
        if (blog) {
            if (blog.writerId == userId) {
                yield (blog === null || blog === void 0 ? void 0 : blog.destroy());
                return res.status(204).json({ message: "deleted", id: blogId });
            }
            return res.status(401).json({ message: "Not authenticated." });
        }
        return res.status(404).json({ message: "Blog not found" });
    }
    catch (err) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.deleteBlog = deleteBlog;
