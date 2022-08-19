import Sequelize from "sequelize";
import { sequelize } from "../utils/database";

export const Blog = sequelize.define("blog", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: Sequelize.STRING,
    content: Sequelize.STRING,
    imageUrl: Sequelize.STRING
});
