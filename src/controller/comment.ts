import { Comment } from "../models/comment";
import { serverError } from "../utils/server-error";

type requestBody = { content: string };

export const getCommentsByBlogId = async (req: any, res: any, next: any) => {
    const blogId = req.params.blogId;
    try {
        const comments = await Comment.findAll({ where: { blogId: blogId } });
        return res.status(200).json({ message: "getting success", comments: comments });
    } catch (error) {
        return serverError(next);
    }
};
export const createComment = async (req: any, res: any, next: any) => {
    const userId = req.session.userId;
    const body = req.body as requestBody;
    const blogId = req.params.blogId;
    try {
        await Comment.create({ ...body, writerId: userId, blogId: blogId })
        return res.status(201).json({ message: "created." });
    } catch (error) {
        return serverError(next);
    }
};
export const updateComment = async (req: any, res: any, next: any) => {
    const userId = req.session.userId;
    const body = req.body as requestBody;
    const commentId = req.params.commentId;
    try {
        const comment: any = await Comment.findByPk(commentId);
        if (comment) {
            if (comment.writerId == userId) {
                await comment?.update({ ...body });
                await comment?.save();
                return res.status(200).json({ message: "updated", id: commentId });
            }
            return res.status(401).json({ message: "Not authenticated." });
        }
        return res.status(404).json({ message: "Comment not found" });

    } catch (error) {
        return serverError(next);
    }
};
export const deleteComment = async (req: any, res: any, next: any) => {
    const userId = req.session.userId;
    const commentId = req.params.commentId;
    try {
        const comment: any = await Comment.findByPk(commentId);
        if (comment) {
            if (comment.writerId == userId) {
                await comment?.destroy();
                return res.status(204).json({ message: "deleted", id: commentId })
            }
            return res.status(401).json({ message: "Not authenticated." });
        }
        return res.status(404).json({ message: "Comment not found" });

    } catch (error) {
        return serverError(next);
    }
};
