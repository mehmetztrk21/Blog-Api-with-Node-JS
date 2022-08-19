"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const comment_1 = require("../controller/comment");
exports.router = (0, express_1.Router)();
exports.router.get("/:blogId", comment_1.getCommentsByBlogId);
exports.router.post("/:blogId", comment_1.createComment);
exports.router.put("/:commentId", comment_1.updateComment);
exports.router.delete("/:commentId", comment_1.deleteComment);