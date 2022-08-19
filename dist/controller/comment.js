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
exports.deleteComment = exports.updateComment = exports.createComment = exports.getCommentsByBlogId = void 0;
const comment_1 = require("../models/comment");
const getCommentsByBlogId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.blogId;
    try {
        const comments = yield comment_1.Comment.findAll({ where: { blogId: blogId } });
        return res.status(200).json({ message: "getting success", comments: comments });
    }
    catch (error) {
        console.log(error);
    }
});
exports.getCommentsByBlogId = getCommentsByBlogId;
const createComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const blogId = req.params.blogId;
    try {
        yield comment_1.Comment.create(Object.assign(Object.assign({}, body), { writerId: 1, blogId: blogId }));
        return res.status(201).json({ message: "created." });
    }
    catch (error) {
        console.log(error);
    }
});
exports.createComment = createComment;
const updateComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const commentId = req.params.commentId;
    try {
        const comment = yield comment_1.Comment.findByPk(commentId);
        yield (comment === null || comment === void 0 ? void 0 : comment.update(Object.assign({}, body)));
        yield (comment === null || comment === void 0 ? void 0 : comment.save());
        return res.status(201).json({ message: "updated", id: commentId });
    }
    catch (error) {
        console.log(error);
    }
});
exports.updateComment = updateComment;
const deleteComment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    try {
        const comment = yield comment_1.Comment.findByPk(commentId);
        yield (comment === null || comment === void 0 ? void 0 : comment.destroy());
        return res.status(204).json({ message: "deleted", id: commentId });
    }
    catch (error) {
    }
});
exports.deleteComment = deleteComment;
