import Sequelize  from "sequelize";
import { sequelize } from "../utils/database";

export const Comment=sequelize.define("Comment",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    content:Sequelize.STRING
})