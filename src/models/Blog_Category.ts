import Sequelize from "sequelize";
import { sequelize } from "../utils/database";

export const blogCategory=sequelize.define("blogCategory",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    }
})