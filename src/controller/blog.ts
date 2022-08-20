import { Blog } from "../models/blog";
import { Category } from "../models/category";
import { Comment } from "../models/comment";
import { serverError } from "../utils/server-error";

type requestBody = { title: string, content: string, imageUrl: string };

export const getBlogs = async (req: any, res: any, next: any) => {
    try {
        const blogs: any = await Blog.findAll({ include: [Comment, { model: Category, through: { attributes: [] } }] });
        return res.status(200).json({ message: "getting success", blogs: blogs });
    } catch (err) {
        return serverError(next);
    }
};
export const createBlog = async (req: any, res: any, next: any) => {
    const userId = req.userId;
    const body = req.body as requestBody;
    try {
        await Blog.create({ ...body, writerId: userId });
    }
    catch (err) {
        return serverError(next);
    }
    return res.status(201).json("created");
};
export const updateBlog = async (req: any, res: any, next: any) => {
    const userId = req.userId;
    const body = req.body as requestBody;
    const blogId = req.params.blogId
    try {
        const blog: any = await Blog.findByPk(blogId);
        if (blog) {
            if (blog.writerId == userId) {
                await blog?.update({ ...body });
                await blog?.save();
                return res.status(204).json({ message: "updated", id: blogId });
            }
            return res.status(401).json({ message: "Not authenticated." })
        }
        return res.status(404).json({ message: "Blog not found" });

    } catch (err) {
        return serverError(next);
    }
};
export const deleteBlog = async (req: any, res: any, next: any) => {
    const blogId = req.params.blogId;
    const userId = req.userId;
    try {
        const blog: any = await Blog.findByPk(req.params.blogId);
        if (blog) {
            if (blog.writerId == userId) {
                await blog?.destroy();
                return res.status(204).json({ message: "deleted", id: blogId });
            }
            return res.status(401).json({ message: "Not authenticated." })
        }
        return res.status(404).json({ message: "Blog not found" });

    } catch (err) {
        return serverError(next);
    }
};