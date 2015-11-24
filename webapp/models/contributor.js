/**
 * Created by kascode on 06.09.15.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
  var Contributor = sequelize.define('Contributor', {
    username: DataTypes.STRING,
    contributions: DataTypes.INTEGER,
    length: DataTypes.INTEGER
  });

  return Contributor;
};