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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.resetCode = exports.updateUser = exports.signOut = exports.signIn = exports.signUp = void 0;
const writer_1 = require("../models/writer");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const server_error_1 = require("../utils/server-error");
const sendgridTransport = require('nodemailer-sendgrid-transport');
const transporter = nodemailer_1.default.createTransport(sendgridTransport({
    auth: {
        api_key: ""
    }
}));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation failed.");
        error.statusCode = 422;
        error.data = errors.array();
        return next(error);
    }
    try {
        const isUser = yield writer_1.User.findOne({ where: { email: body.email } });
        if (!isUser) {
            body.password = yield bcryptjs_1.default.hash(body.password, 12);
            yield writer_1.User.create(Object.assign({}, body));
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
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = yield writer_1.User.findOne({ where: { email: body.email } });
        if (user) {
            const isEqual = yield bcryptjs_1.default.compare(body.password, user.password);
            if (isEqual) {
                const token = jsonwebtoken_1.default.sign({
                    email: user.email,
                    userId: user.id.toString()
                }, 'somesupersecretsecret', { expiresIn: '1h' });
                req.session.isLoggedIn = true;
                return res.status(200).json({ token: token, userId: user.id.toString() });
            }
            return res.status(401).json({ message: "invalid password." });
        }
        return res.status(401).json({ message: "invalid email." });
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.signIn = signIn;
const signOut = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
            // signout demek session ı temizle demek
            // sessiondaki tüm keyleri al tek tek sil demek bu
            // direkt obje gönderirsen yakalayamayabilir...
            //abi ben session u kullanmadım ama sadece olur mu diye işte req.session=true yaptım.
            // jwt tokenın güvenlik için kullanılıyor sessinda da bu adamın oturumu var mı yani giriş yaptı mı onu kontrol edersin bir de token verify yaparsın geçerli mi değil mi diye o kadar :)
            //böyle bir mekanizma kurdum abi
            // session ı jwt ile entegre et öyle dene bir de nasıl yani abi şu anda seSSİONDA USER BİLGİSİ TUTOYRUM 
            // TAMAM İŞTe ek olarak session ile jwt yi eşleştiren bir id kullan session idni jwtnin içine göm verify ettikten sonra sessionid = jwt.sessionid kontrolü ekle eğer başarısız olursa 401 unauthorized ver :) dene bi ondan sonra anlayacaksın ne demek istediğimi tamamdır abi deniyim :))kolay gele öptüm baba sağol abi sana da :)e
            delete req.session.userId;
            return res.status(200).json({ message: "You are logged out success." });
        }
    }
});
exports.signOut = signOut;
const updateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.session.userId;
    const body = req.body;
    try {
        const user = yield writer_1.User.findByPk(userId);
        if (user) {
            yield user.update(Object.assign({}, body));
            yield user.save();
            return res.status(200).json({ message: "User updated success" });
        }
        return res.status(404).json({ message: "User not found." });
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.updateUser = updateUser;
const resetCode = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const resetCode = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
    try {
        const user = yield writer_1.User.findOne({ where: { email: email } });
        if (user) {
            yield user.update({ resetCode: resetCode, resetCodeExpiration: Date.now() + 3600000 });
            yield user.save();
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
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.resetCode = resetCode;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const code = req.body.code;
    let password = req.body.password;
    try {
        const user = yield writer_1.User.findOne({ where: { email: email } });
        if (user) {
            if (code == user.resetCode && user.resetCodeExpiration > Date.now()) {
                password = yield bcryptjs_1.default.hash(password, 12);
                yield user.update({ password: password, resetCode: null, resetCodeExpiration: null });
                yield user.save();
                return res.status(200).json({ message: "password changed successfully" });
            }
            return res.status(400).json({ message: "Code is not valid." });
        }
        return res.status(404).json({ message: "User not found." });
    }
    catch (error) {
        return (0, server_error_1.serverError)(next);
    }
});
exports.resetPassword = resetPassword;
