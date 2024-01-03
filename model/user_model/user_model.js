const Sequelize = require("sequelize");
const db = require("../../utils/database_connection");
const Gender = require("../gender_model/gender_model");

const Users = db.define("user", {
  user_id: {
    type: Sequelize.DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: Sequelize.DataTypes.STRING,
  },
  email: {
    type: Sequelize.DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.DataTypes.STRING,
  },
  accessToken: {
    type: Sequelize.DataTypes.STRING,
  },
  phoneNumber: {
    type: Sequelize.DataTypes.STRING,
  },
  dob: {
    type: Sequelize.DataTypes.STRING,
  },
  profileUrl: {
    type: Sequelize.DataTypes.STRING,
  },
});

Users.belongsTo(Gender, { foreignKey: "genderId" });

module.exports = Users;
