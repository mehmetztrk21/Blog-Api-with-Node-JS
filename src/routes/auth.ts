import  Express, { Router }  from "express";
import { signIn, signUp } from "../controller/auth";

export const router=Router();

router.post("/signup",signUp);

router.post("/signin",signIn);