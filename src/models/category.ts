import  Sequelize  from "sequelize";
import { sequelize } from "../utils/database";

export const Category=sequelize.define("category",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:Sequelize.STRING
});