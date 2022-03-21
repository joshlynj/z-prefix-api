require("dotenv").config();
const knex = require("knex");

const knexConfigs = require("../knexfile.js");
//console.log(process.env);
const currentConfig = knexConfigs[process.env.NODE_ENV || "development"];

const dbConnection = knex(currentConfig);

module.exports = dbConnection;
