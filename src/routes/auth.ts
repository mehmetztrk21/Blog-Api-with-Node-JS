import Express, { Router } from "express";
import { resetCode, resetPassword, signIn, signOut, signUp, updateUser } from "../controller/auth";
import { isAuth } from "../middleware/is-auth";
import { body, check } from "express-validator";

export const router = Router();

router.post("/signup", [
    body("name").isString().withMessage("Name is string.").isLength({ min: 1 }).trim().withMessage("Name is min 1 character."),
    body("surname").isString().withMessage("Surname is string.").isLength({ min: 1 }).trim().withMessage("Surname is min 1 character."),
    body("email").isEmail().withMessage("Email is not valid."),
    body("password", "invalid password").isLength({ min: 3 }).trim().withMessage("Password is min 3 character.").custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
            return Promise.reject("Passwords don't match.");
        }
        else {
            return value;
        }
    })
], signUp);

router.post("/signin", [
    body("email").isEmail().trim().withMessage("Email is not valid.").notEmpty().withMessage("Email is required"),
    body("password").notEmpty().withMessage("Password is required.")
], signIn);

router.post("/signout",isAuth,signOut);

router.put("/update", isAuth, updateUser);

router.post("/resetCode", resetCode);

router.post("/resetPassword", [
    body("code").notEmpty().withMessage("Code is required"),
    body("password", "invalid password").isLength({ min: 3 }).trim().withMessage("Password is min 3 character.").custom((value, { req }) => {
        if (value !== req.body.confirmPassword) {
            return Promise.reject("Passwords don't match.");
        }
        else {
            return value;
        }
    }),
    body("email").notEmpty().withMessage("Email is required.")
], resetPassword)
