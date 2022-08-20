"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const auth_1 = require("../controller/auth");
const is_auth_1 = require("../middleware/is-auth");
const express_validator_1 = require("express-validator");
exports.router = (0, express_1.Router)();
exports.router.post("/signup", [
    (0, express_validator_1.body)("name").isString().withMessage("Name is string.").isLength({ min: 1 }).trim().withMessage("Name is min 1 character."),
    (0, express_validator_1.body)("surname").isString().withMessage("Surname is string.").isLength({ min: 1 }).trim().withMessage("Surname is min 1 character."),
    (0, express_validator_1.body)("email").isEmail().withMessage("Email is not valid."),
    (0, express_validator_1.body)("password", "invalid password").isLength({ min: 3 }).trim().withMessage("Password is min 3 character.").custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
            return Promise.reject("Passwords don't match.");
        }
        else {
            return value;
        }
    })
], auth_1.signUp);
exports.router.post("/signin", [
    (0, express_validator_1.body)("email").isEmail().trim().withMessage("Email is not valid.").notEmpty().withMessage("Email is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required.")
], auth_1.signIn);
exports.router.put("/update", is_auth_1.isAuth, auth_1.updateUser);
exports.router.post("/resetCode", auth_1.resetCode);
exports.router.post("/resetPassword", [
    (0, express_validator_1.body)("code").notEmpty().withMessage("Code is required"),
    (0, express_validator_1.body)("password", "invalid password").isLength({ min: 3 }).trim().withMessage("Password is min 3 character.").custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
            return Promise.reject("Passwords don't match.");
        }
        else {
            return value;
        }
    }),
    (0, express_validator_1.body)("email").notEmpty().withMessage("Email is required.")
], auth_1.resetPassword);
