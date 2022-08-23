import { User } from "../models/writer";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import { serverError } from "../utils/server-error";
const sendgridTransport = require('nodemailer-sendgrid-transport');

type signUpBody = { name: string, surname: string, phone: string, email: string, password: string };
type updateBody = { name: string, surname: string, phone: string, email: string };
type signInBody = { email: string, password: string };

const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: ""
    }
}))


export const signUp = async (req: any, res: any, next: any) => {
    const body = req.body as signUpBody;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error: any = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
    try {
        const isUser = await User.findOne({ where: { email: body.email } });
        if (!isUser) {
            body.password = await bcryptjs.hash(body.password, 12);
            await User.create({ ...body });
            // transporter.sendMail({
            //     to: req.body.email,
            //     from: "@gmail.com",
            //     subject: "Welcome",
            //     html: `
            //     <p>WELCOME TO FAMİLY</p>
            //     <p>Welcome to our family ${body.name}</p>
            //     `
            // });
            return res.status(201).json({ message: "created" });
        }
        return res.status(401).json({ message: "user is already exists." });

    } catch (error) {
        return serverError(next);
    }
};
export const signIn = async (req: any, res: any, next: any) => {
    const body = req.body as signInBody;
    try {
        const user: any = await User.findOne({ where: { email: body.email } });
        if (user) {
            const isEqual = await bcryptjs.compare(body.password, user.password);
            if (isEqual) {
                const token = jwt.sign(
                    {
                        email: user.email,
                        userId: user.id.toString()
                    },
                    'somesupersecretsecret',
                    { expiresIn: '1h' }
                );
                req.session.isLoggedIn = true;
                return res.status(200).json({ token: token, userId: user.id.toString() });
            }
            return res.status(401).json({ message: "invalid password." });
        }
        return res.status(401).json({ message: "invalid email." });

    } catch (error) {
        return serverError(next);
    }
};

export const signOut = async (req: any, res: any, next: any) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            delete req.session.userId;
            return res.status(200).json({ message: "You are logged out success." })
        }
    }
}

export const updateUser = async (req: any, res: any, next: any) => {
    const userId = req.session.userId;
    const body = req.body as updateBody;
    try {
        const user: any = await User.findByPk(userId);
        if (user) {
            await user.update({ ...body });
            await user.save();
            return res.status(200).json({ message: "User updated success" });
        }
        return res.status(404).json({ message: "User not found." });
    } catch (error) {
        return serverError(next);
    }
}

export const resetCode = async (req: any, res: any, next: any) => {
    const email = req.body.email;
    const resetCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    try {
        const user: any = await User.findOne({ where: { email: email } });
        if (user) {
            await user.update({ resetCode: resetCode, resetCodeExpiration: Date.now() + 3600000 });
            await user.save();
            transporter.sendMail({
                to: req.body.email,
                from: "@gmail.com",
                subject: "Reset Password",
                html: `
                    <p>You requested a password reset</p>
                    <p>Reset code for password reset: ${resetCode}</p>
                    `
            });
            return res.status(200).json({ message: "We send reset password code. Please check email." });
        }
        return res.status(404).json({ message: "User not found." });
    } catch (error) {
        return serverError(next);
    }
}

export const resetPassword = async (req: any, res: any, next: any) => {
    const email = req.body.email;
    const code = req.body.code;
    let password = req.body.password;
    try {
        const user: any = await User.findOne({ where: { email: email } });
        if (user) {
            if (code == user.resetCode && user.resetCodeExpiration > Date.now()) {
                password = await bcryptjs.hash(password, 12);
                await user.update({ password: password, resetCode: null, resetCodeExpiration: null });
                await user.save();
                return res.status(200).json({ message: "password changed successfully" });
            }
            return res.status(400).json({ message: "Code is not valid." });
        }
        return res.status(404).json({ message: "User not found." });

    } catch (error) {
        return serverError(next);
    }
}