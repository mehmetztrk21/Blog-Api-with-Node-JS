import { Router } from "express";
import { createComment, deleteComment, getCommentsByBlogId, updateComment } from "../controller/comment";

export const router=Router();

router.get("/:blogId",getCommentsByBlogId);

router.post("/:blogId",createComment);

router.put("/:commentId",updateComment);

router.delete("/:commentId",deleteComment);