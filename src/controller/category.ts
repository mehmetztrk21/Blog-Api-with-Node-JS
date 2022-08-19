import { Category } from "../models/category";

type requestBody = { name: String };

export const getCategories = async (req: any, res: any, next: any) => {
    try {
        const categories = await Category.findAll();
        return res.status(200).json({ message: "getting success", categories: categories });
    } catch (error) {
        console.log(error);
    }
};
export const createCategory = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    try {
        await Category.create({ ...body });
        return res.status(201).json({ message: "created" });
    } catch (error) {
        console.log(error);
    }
};
export const updateCategory = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findByPk(categoryId);
        await category?.update({ ...body });
        await category?.save();
        return res.status(201).json({ message: "updated", id: categoryId });
    } catch (error) {
        console.log(error);
    }
};
export const deleteCategory = async (req: any, res: any, next: any) => {
    const categoryId = req.params.categoryId;
    try {
        const category = await Category.findByPk(categoryId);
        await category?.destroy();
    } catch (error) {
        console.log(error);
    }
}