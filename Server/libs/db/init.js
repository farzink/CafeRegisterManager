//import Sequelize from "sequelize";
const Sequelize = require('sequelize');
const config = require("../configuration")
import fs from "fs";
import path from "path";

let db = null;

module.exports = app => {
    if (!db) {
        //const config = app.libs.configuration;
        const sequelize = new Sequelize(
            config.database,
            config.username,
            config.password,
            config.params
        );
        db = {
            sequelize,
            Sequelize,
            models: {}
        };


        const dir = path.join(__dirname, "../../models/db/sql");
        fs.readdirSync(dir).forEach(file => {
            const modelDir = path.join(dir, file);
            // console.log(modelDir);
            const model = sequelize.import(modelDir);
            db.models[model.name] = model;
        });
        Object.keys(db.models).forEach(key => {
            if (db.models[key].associate)
                db.models[key].associate(db.models);
        });
    }
    return db;
};