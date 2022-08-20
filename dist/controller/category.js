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
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategories = void 0;
const category_1 = require("../models/category");
const server_error_1 = require("../utils/server-error");
const getCategories = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_1.Category.findAll();
        return res.status(200).json({ message: "getting success", categories: categories });
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.getCategories = getCategories;
const createCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        yield category_1.Category.create(Object.assign({}, body));
        return res.status(201).json({ message: "created" });
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.createCategory = createCategory;
const updateCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const categoryId = req.params.categoryId;
    try {
        const category = yield category_1.Category.findByPk(categoryId);
        yield (category === null || category === void 0 ? void 0 : category.update(Object.assign({}, body)));
        yield (category === null || category === void 0 ? void 0 : category.save());
        return res.status(200).json({ message: "updated", id: categoryId });
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
        const category = yield category_1.Category.findByPk(categoryId);
        yield (category === null || category === void 0 ? void 0 : category.destroy());
        return res.status(204).json({ message: "deleted." });
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.deleteCategory = deleteCategory;
