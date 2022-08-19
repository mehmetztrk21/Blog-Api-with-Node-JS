import { Express, Router } from "express";
import {createBlog, deleteBlog, getBlogs, updateBlog} from "../controller/blog"

export const router= Router();

router.get("/",getBlogs);

router.post("/",createBlog);

router.put("/:blogId",updateBlog);

router.delete("/:blogId",deleteBlog);