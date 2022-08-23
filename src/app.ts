import bodyParser from "body-parser";
import express from "express";
import { Blog } from "./models/blog";
import { blogCategory } from "./models/Blog_Category";
import { Category } from "./models/category";
import { Comment } from "./models/comment";
import { User } from "./models/writer"
import { sequelize } from "./utils/database"

import { router as blogRoutes } from "./routes/blog";
import { router as commentRoutes } from "./routes/comment";
import { router as authRoutes } from "./routes/auth";
import { router as categoryController } from "./routes/category";

const session=require('express-session');
const app = express();


app.use(session({secret:"my secret",resave:false,saveUnitialized:false}));


app.use(bodyParser.json());


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});


app.use("/blog", blogRoutes);
app.use("/comment", commentRoutes);
app.use("/auth", authRoutes);
app.use("/category", categoryController);

app.use((error: any, req: any, res: any, next: any) => {
    const status = error.statusCode || 500;
    const message = error.message || "Error";
    const data = error.data || "Error";
    res.status(status).json({ message: message, data: data });
});


Blog.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Blog);

Comment.belongsTo(User, {
    constraints: true,
    onDelete: "CASCADE"
});
User.hasMany(Comment);

Comment.belongsTo(Blog, {
    constraints: true,
    onDelete: "CASCADE"
});
Blog.hasMany(Comment);

Category.belongsToMany(Blog, { through: blogCategory });
Blog.belongsToMany(Category, { through: blogCategory })

sequelize.sync()
    .then((result:any) => {
        return User.count();
    })
    .then((res:any) => {
        console.log('Connection has been established successfully.');
        if (res < 0)
            User.create({ name: "Ali", email: "test@gmail.com" })
        app.listen(3000);
    })
    .catch((err:any) => { console.log(err); });


