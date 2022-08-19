import { Blog } from "../models/blog";
import { Category } from "../models/category";
import { Comment } from "../models/comment";

type requestBody = { title: string, content: string, imageUrl: string };

export const getBlogs = async (req: any, res: any, next: any) => {
    try {
        const blogs: any = await Blog.findAll({ include: [Comment, { model: Category, through: { attributes: [] } }] });
        return res.status(200).json({ message: "getting success", blogs: blogs });
    } catch (error) {
        console.log(error);
    }
};
export const createBlog = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    const title = req.body.title;
    const content = req.body.content;
    const imageUrl = req.body.imageUrl;
    try {
        await Blog.create({ ...body, writerId: 1 });
    }
    catch (err) {
        console.log(err);
    }
    return res.status(201).json("created");
};
export const updateBlog = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    const blogId = req.params.blogId
    try {
        const blog = await Blog.findByPk(blogId);
        await blog?.update({ ...body });
        await blog?.save();
        return res.status(201).json({ message: "updated", id: blogId });
    } catch (error) {
        console.log("ERROR:", error);
    }
};
export const deleteBlog = async (req: any, res: any, next: any) => {
    const blogId = req.params.blogId;
    try {
        const blog = await Blog.findByPk(req.params.blogId);
        await blog?.destroy();
        return res.status(204).json({ message: "deleted", id: blogId });
    } catch (error) {
        console.log(error);
    }
};