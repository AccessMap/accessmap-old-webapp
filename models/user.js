'use strict';


module.exports = function(sequelize, DataTypes) {
  var user_attributes = {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        is: /^[a-z0-9\_\-]+$/i,
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
    },
    salt: {
      type: DataTypes.STRING
    }
  };

  var user_options = {
    freezeTableName: true
  };

  var User = sequelize.define('user', user_attributes, user_options);
  return User;
};
