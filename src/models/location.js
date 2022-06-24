const {DataTypes} = require('sequelize')

module.exports = (sequelize) => {
  sequelize.define('location', {
    city:{
        type: DataTypes.STRING
    },
    coorCityLat:{
        type:DataTypes.FLOAT
    },
    coorCitylng:{
        type:DataTypes.FLOAT
    },
    name:{
        type: DataTypes.STRING
    },
    lat:{
        type:DataTypes.FLOAT
    },
    lng:{
        type:DataTypes.FLOAT
    }
  },{timestamps: true,
    createdAt: true,
    updatedAt: false
  });
};