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
import {router as authRoutes } from "./routes/auth";
const app = express();
app.use(bodyParser.json());

app.use("/blog", blogRoutes);
app.use("/comment", commentRoutes);
app.use("/auth",authRoutes);



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
    .then(result => {
        return User.count();
    })
    .then(res => {
        console.log(res);
        console.log('Connection has been established successfully.');
        if (res < 0)
            User.create({ name: "Ali", email: "test@gmail.com" })
        app.listen(3000);
    })
    .catch(err => { console.log(err); });


