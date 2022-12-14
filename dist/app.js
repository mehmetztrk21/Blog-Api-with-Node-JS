"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const blog_1 = require("./models/blog");
const Blog_Category_1 = require("./models/Blog_Category");
const category_1 = require("./models/category");
const comment_1 = require("./models/comment");
const writer_1 = require("./models/writer");
const database_1 = require("./utils/database");
const blog_2 = require("./routes/blog");
const comment_2 = require("./routes/comment");
const auth_1 = require("./routes/auth");
const category_2 = require("./routes/category");
const session = require('express-session');
const express_session_sqlite_1 = __importDefault(require("express-session-sqlite"));
const SqliteStore = (0, express_session_sqlite_1.default)(session);
const app = (0, express_1.default)();
app.use(session({ secret: "my secret", resave: false, saveUnitialized: false }));
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use("/blog", blog_2.router);
app.use("/comment", comment_2.router);
app.use("/auth", auth_1.router);
app.use("/category", category_2.router);
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message || "Error";
    const data = error.data || "Error";
    res.status(status).json({ message: message, data: data });
});
blog_1.Blog.belongsTo(writer_1.User, {
    constraints: true,
    onDelete: "CASCADE"
});
writer_1.User.hasMany(blog_1.Blog);
comment_1.Comment.belongsTo(writer_1.User, {
    constraints: true,
    onDelete: "CASCADE"
});
writer_1.User.hasMany(comment_1.Comment);
comment_1.Comment.belongsTo(blog_1.Blog, {
    constraints: true,
    onDelete: "CASCADE"
});
blog_1.Blog.hasMany(comment_1.Comment);
category_1.Category.belongsToMany(blog_1.Blog, { through: Blog_Category_1.blogCategory });
blog_1.Blog.belongsToMany(category_1.Category, { through: Blog_Category_1.blogCategory });
database_1.sequelize.sync()
    .then((result) => {
    return writer_1.User.count();
})
    .then((res) => {
    console.log('Connection has been established successfully.');
    if (res < 0)
        writer_1.User.create({ name: "Ali", email: "test@gmail.com" });
    app.listen(3000);
})
    .catch((err) => { console.log(err); });
