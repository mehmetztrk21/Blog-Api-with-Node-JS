import { Express, Router } from "express";
import {createBlog, deleteBlog, getBlogs, updateBlog} from "../controller/blog"
import {isAuth} from "../middleware/is-auth";
export const router= Router();

router.get("/",getBlogs);

router.post("/",isAuth,createBlog);

router.put("/:blogId",isAuth,updateBlog);

router.delete("/:blogId",isAuth,deleteBlog);