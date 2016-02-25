'use strict';
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var db = {}

if (env === 'production') {
  var sequelize = new Sequelize(process.env.DATABASE_URL);
} else if(env === 'development') {
  // Create a local sqlite database for development + testing
  var sequelize = new Sequelize('local', 'test', 'test', {
    dialect: 'sqlite',
    storage: 'db.sqlite'
  });
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== "index.js");
  })
  .forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if ("associate" in db[modelName]) {
    db[modelName].associate(db);
  }
});



db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;
