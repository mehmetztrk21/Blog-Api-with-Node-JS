"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Comment = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const database_1 = require("../utils/database");
exports.Comment = database_1.sequelize.define("Comment", {
    id: {
        type: sequelize_1.default.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    content: sequelize_1.default.STRING
});
