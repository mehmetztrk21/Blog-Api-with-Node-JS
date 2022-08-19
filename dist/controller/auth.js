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
exports.signIn = exports.signUp = void 0;
const writer_1 = require("../models/writer");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        // body.password= hash
        const isUser = yield writer_1.User.findOne({ where: { email: body.email } });
        if (!isUser) {
            body.password = yield bcryptjs_1.default.hash(body.password, 12);
            yield writer_1.User.create(Object.assign({}, body));
            return res.status(201).json({ message: "created" });
        }
        return res.status(401).json({ message: "user is already exists." });
    }
    catch (error) {
        console.log(error);
    }
});
exports.signUp = signUp;
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = yield writer_1.User.findOne({ where: { email: body.email } });
    if (user) {
        const isEqual = yield bcryptjs_1.default.compare(body.password, user.password);
        if (isEqual) {
            const token = jsonwebtoken_1.default.sign({
                email: user.email,
                userId: user.id.toString()
            }, 'somesupersecretsecret', { expiresIn: '1h' });
            return res.status(200).json({ token: token, userId: user.id.toString() });
        }
        return res.status(401).json({ message: "invalid password." });
    }
    return res.status(401).json({ message: "invalid email." });
});
exports.signIn = signIn;
