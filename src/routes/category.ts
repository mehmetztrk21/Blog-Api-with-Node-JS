import { Router } from "express";
import { createCategory, deleteCategory, getCategories, updateCategory } from "../controller/category";
import { isAuth } from "../middleware/is-auth";


export const router=Router();

router.get("/",isAuth,getCategories);
router.post("/",isAuth,createCategory);
router.put("/:categoryId",isAuth,updateCategory);
router.delete("/:categoryId",isAuth,deleteCategory);