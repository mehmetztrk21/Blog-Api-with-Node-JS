import jwt from "jsonwebtoken";

export const isAuth = (req: any, res: any, next: any) => {
    const authHeader = req.get("Authorization");
    console.log(authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    const token = authHeader.split(" ")[1];

    let decodedToken: any;
    try {
        decodedToken = jwt.verify(token, "somesupersecretsecret");

    } catch (error) {
        return res.status(403).json({ message: "Not authenticated." });
    }
    if (!decodedToken) {
        return res.status(401).json({ message: "Not authenticated." });
    }
    req.session.userId = decodedToken.userId;
    next();
};

