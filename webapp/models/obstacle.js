/**
 * Created by kascode on 26.06.15.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
  var Obstacle = sequelize.define('Obstacle', {
    address: DataTypes.STRING,
    lat: DataTypes.DECIMAL(10,7),
    lng: DataTypes.DECIMAL(10,7),
    photoPath: DataTypes.STRING
  });

  return Obstacle;
};