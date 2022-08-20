import { Router } from "express";
import { createComment, deleteComment, getCommentsByBlogId, updateComment } from "../controller/comment";
import { isAuth } from "../middleware/is-auth";

export const router=Router();

router.get("/:blogId",getCommentsByBlogId);

router.post("/:blogId",isAuth,createComment);

router.put("/:commentId",isAuth,updateComment);

router.delete("/:commentId",isAuth,deleteComment);