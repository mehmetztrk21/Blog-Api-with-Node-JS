import { Category } from "../models/category";
import { serverError } from "../utils/server-error";

type requestBody = { name: String };

export const getCategories = async (req: any, res: any, next: any) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json({ message: "getting success", categories: categories });
    } catch (error) {
        return serverError(next);
    }
};
export const createCategory = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    try {
        await Category.create({ ...body });
        return res.status(201).json({ message: "created" });
    } catch (error) {
        return serverError(next);
    }
};
export const updateCategory = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findByPk(categoryId);
        await category?.update({ ...body });
        await category?.save();
        return res.status(200).json({ message: "updated", id: categoryId });
    } catch (error) {
        return serverError(next);
    }
};
export const deleteCategory = async (req: any, res: any, next: any) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findByPk(categoryId);
        await category?.destroy();
        return res.status(204).json({ message: "deleted." });
    } catch (error) {
        return serverError(next);
    }
}