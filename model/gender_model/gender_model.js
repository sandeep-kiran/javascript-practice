const Sequelize = require("sequelize");
const db = require("../../utils/database_connection");

const Gender = db.define("gender", {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  gender: {
    type: Sequelize.DataTypes.STRING,
  },
});

module.exports = Gender;
