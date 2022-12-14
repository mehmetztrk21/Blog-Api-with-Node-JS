"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const category_1 = require("../controller/category");
const is_auth_1 = require("../middleware/is-auth");
exports.router = (0, express_1.Router)();
exports.router.get("/", is_auth_1.isAuth, category_1.getCategories);
exports.router.post("/", is_auth_1.isAuth, category_1.createCategory);
exports.router.put("/:categoryId", is_auth_1.isAuth, category_1.updateCategory);
exports.router.delete("/:categoryId", is_auth_1.isAuth, category_1.deleteCategory);
