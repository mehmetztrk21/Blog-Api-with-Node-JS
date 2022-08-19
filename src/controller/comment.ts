import { Comment } from "../models/comment";

type requestBody = { content: string };

export const getCommentsByBlogId = async (req: any, res: any, next: any) => {
    const blogId = req.params.blogId;
    try {
        const comments = await Comment.findAll({ where: { blogId: blogId } });
        return res.status(200).json({ message: "getting success", comments: comments });
    } catch (error) {
        console.log(error);
    }
};
export const createComment = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    const blogId = req.params.blogId;
    try {
        await Comment.create({ ...body, writerId: 1, blogId: blogId })
        return res.status(201).json({ message: "created." });
    } catch (error) {
        console.log(error);
    }
};
export const updateComment = async (req: any, res: any, next: any) => {
    const body = req.body as requestBody;
    const commentId = req.params.commentId;
    try {
        const comment = await Comment.findByPk(commentId);
        await comment?.update({ ...body });
        await comment?.save();
        return res.status(201).json({ message: "updated", id: commentId });
    } catch (error) {
        console.log(error);
    }
};
export const deleteComment = async (req: any, res: any, next: any) => {
    const commentId = req.params.commentId;
    try {
        const comment = await Comment.findByPk(commentId);
        await comment?.destroy();
        return res.status(204).json({ message: "deleted", id: commentId })
    } catch (error) {

    }
};
