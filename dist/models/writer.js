"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = require("../utils/database");
exports.User = database_1.sequelize.define("writer", {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name: sequelize_1.default.STRING,
    surname: sequelize_1.default.STRING,
    phone: sequelize_1.default.STRING,
    email: sequelize_1.default.STRING,
    password: sequelize_1.default.STRING,
    resetCode: sequelize_1.default.STRING,
    resetCodeExpiration: sequelize_1.default.DATE
});
