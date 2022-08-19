import { User } from "../models/writer";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
type signUpBody = { name: string, surname: string, phone: string, email: string, password: string };
type signInBody = { email: string, password: string };
export const signUp = async (req: any, res: any, next: any) => {
    const body = req.body as signUpBody;
    try {
        // body.password= hash
        const isUser = await User.findOne({ where: { email: body.email } });
        if (!isUser) {
            body.password = await bcryptjs.hash(body.password, 12);
            await User.create({ ...body });
            return res.status(201).json({ message: "created" });
        }
        return res.status(401).json({ message: "user is already exists." });

    } catch (error) {
        console.log(error);
    }
};
export const signIn = async (req: any, res: any, next: any) => {
    const body = req.body as signInBody;
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
            return res.status(200).json({ token: token, userId: user.id.toString() });
        }
        return res.status(401).json({ message: "invalid password." });
    }
    return res.status(401).json({ message: "invalid email." });
}