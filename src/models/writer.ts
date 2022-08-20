import Sequelize from "sequelize";

import { sequelize } from "../utils/database";

export const User=sequelize.define("writer",{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:Sequelize.STRING,
    surname:Sequelize.STRING,
    phone:Sequelize.STRING,
    email:Sequelize.STRING,
    password:Sequelize.STRING,
    resetCode:Sequelize.STRING,
    resetCodeExpiration:Sequelize.DATE
});

