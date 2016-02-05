var Sequelize = require('sequelize');

var mydb = new Sequelize(process.env.DATABASE_URL);

var user_attributes = {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      is: /^[a-z0-9\_\-]+$/i,
    }
  },
  email: {
    type: Sequelize.STRING,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
  },
  salt: {
    type: Sequelize.STRING
  }
};

var user_options = {
  freezeTableName: true
};

var User = mydb.define('user', user_attributes, user_options);

module.exports = User;
